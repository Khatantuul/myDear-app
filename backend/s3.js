import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import { config } from "dotenv";
import { url } from "inspector";
import Photo from "./app/models/photo.js";

config();

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const uploadFile = async (compressed, userId, albumId) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `${userId}/${albumId}/${compressed.photoId}`,
    Body: compressed.buffer,
    ContentType: compressed.mimetype,
  });

  return s3
    .send(command)
    .then((data) => {
      const fileUrl = `https://${bucket}.s3.amazonaws.com/${compressed.photoId}`;
      return fileUrl;
    })
    .catch((err) => {
      console.error("Error uploading file", err);
    });
};
export const getAllImageKeys = async (userId) => {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: userId,
  });

  try {
    const { Contents = [] } = await s3.send(command);
    return Contents.map(
      (image) => image.Key
      //  ur: `https://${bucket}.s3.amazonaws.com/${image.Key}`
      // ETag
    );
  } catch (err) {
    console.error("Error retrieving file from S3", err);
    throw err;
  }
};

export const getAlbumImageKeys = async (userId, albumId, preview) => {
  if (!userId || !albumId) {
    throw new Error("userId or albumId not received");
  }

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `${userId}/${albumId}`,
  });

  try {
    const { Contents = [] } = await s3.send(command);

    if (preview) {
      const limited = Contents.slice(0, 4);
      return limited.map((image) => image.Key);
    }
    return Contents.map(
      (image) => image.Key
      // ETag
    );
  } catch (err) {
    console.error("Error retrieving file from S3", err);
    throw err;
  }
};

export const getPresignedUrls = async (imageKeys) => {
  try {
    const presignedUrls = [];

    for (const key of imageKeys) {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const s3urlKey = key.split("/")[2];

      const photoDetails = await Photo.findOne({
        url: `https://${bucket}.s3.amazonaws.com/${s3urlKey}`,
      });
      const { _id, note, tags } = photoDetails || {};

      const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

      presignedUrls.push({
        presignedUrl: presignedUrl,
        photoId: _id,
        note: note,
        tags: tags,
      });
    }

    return presignedUrls;
  } catch (err) {
    throw err;
  }
};

export const deletePhotosFromS3 = async (userId, albumId, photos) => {
  if (!userId || !albumId || !photos) {
    throw new Error("userId, albumId or photos not received");
  }

  try {
    const objectsToDelete = photos.map((photoID) => ({
      Key: `${userId}/${albumId}/${photoID}`,
    }));

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: objectsToDelete },
    });
    const deleteResponse = await s3.send(deleteCommand);
  } catch (err) {
    console.error("Error deleting files from S3", err);
    throw err;
  }
};

export const deleteAlbumFromS3 = async (userId, albumId) => {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `${userId}/${albumId}`,
  });

  try {
    const listResponse = await s3.send(command);
    if (!listResponse.Contents) {
      return;
    }
    const objectsToDelete = listResponse.Contents.map((obj) => ({
      Key: obj.Key,
    }));

    if (objectsToDelete.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: objectsToDelete },
      });
      const deleteResponse = await s3.send(deleteCommand);
    }
  } catch (err) {
    console.error("Error deleting album from S3:", err);
    throw err;
  }
};
