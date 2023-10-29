import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import {config} from "dotenv";
import { url } from "inspector";
import Photo from './app/models/photo.js';

config();

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
    region,
    credentials:{
        accessKeyId,
        secretAccessKey
    }
  });

export const uploadFile = async (compressed, userId, albumId) => {

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: `${userId}/${albumId}/${compressed.filename}`,
            Body: compressed.buffer,
            ContentType: compressed.mimetype,
          });
        

        return s3.send(command)
        .then((data)=>{
            console.log("File uploaded successfully")
            const fileUrl = `https://${bucket}.s3.amazonaws.com/${compressed.filename}`;
            return fileUrl;
        })
        .catch((err)=>{
            console.error("Error uploading file",err)
        })
    
}
export const getAllImageKeys = async (userId) => {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: userId,
    });
  
    try {
      const {Contents = []} = await s3.send(command);
      console.log('contents', Contents)
      return Contents.map(image =>
         image.Key
        //  ur: `https://${bucket}.s3.amazonaws.com/${image.Key}`
        // ETag
        )
    } catch (err) {
      console.error('Error retrieving file from S3', err);
      throw err; 
    }
  };

export const getAlbumImageKeys = async (userId, albumId, preview) => {

    if(!userId || !albumId){
      throw new Error('userId or albumId not received');
    }

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: `${userId}/${albumId}`,
    });
  
    try {
      const {Contents = []} = await s3.send(command);

      console.log('is this causing issue')
      if(preview){
        const limited = Contents.slice(0,4);
        return limited.map(image => image.Key);

      }

      console.log('contents', Contents)
      return Contents.map(image =>
         image.Key
        // ETag
        )
    } catch (err) {
      console.error('Error retrieving file from S3', err);
      throw err; 
    }
  };
// export const getAlbumImageKeysForPreview = async (userId, albumId) => {
//     const command = new ListObjectsV2Command({
//       Bucket: bucket,
//       Prefix: `${userId}/${album._id}`,
//     });
  
//     try {
//       const {Contents = []} = await s3.send(command);
//       // console.log('contents', Contents)
//       return Contents.map(image =>
//          image.Key
//         //  ur: `https://${bucket}.s3.amazonaws.com/${image.Key}`
//         // ETag
//         )
//     } catch (err) {
//       console.error('Error retrieving file from S3', err);
//       throw err; 
//     }
//   };

// export const getPresignedUrls = async (userId) => {
//     try{
//         const imageKeys = await getImageKeys(userId);

//         const presignedUrls = await Promise.all( imageKeys.map(key=>{
//             const command = new GetObjectCommand({Bucket: bucket, Key: key});

//            const photoDetails = await Photo.findOne({s3url: `https://${bucket}.s3.amazonaws.com/${key}`});
//             const {note, tags} = photoDetails;
//             console.log('photodetails',photoDetails)
//             return getSignedUrl(s3, command, { expiresIn: 900 })
//         })
//         )

//         return presignedUrls;
//     }catch(err){
//         console.log(err);
//         throw err; 
//     }
// }

export const getPresignedUrls = async (userId, albumId, preview) => {

  try {

    let imageKeys = []
    if(userId && albumId === null && !preview){
      imageKeys = await getAllImageKeys(userId);
    }else if(userId && albumId && !preview){
      imageKeys = await getAlbumImageKeys(userId, albumId);
    }else if(userId && albumId && preview){
      imageKeys = await getAlbumImageKeys(userId, albumId, preview);
    }
    
    const presignedUrls = [];
    
    for (const key of imageKeys) {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const s3urlKey = key.split('/')[2];

      const photoDetails = await Photo.findOne({ url: `https://${bucket}.s3.amazonaws.com/${s3urlKey}` });
      const { note, tags } = photoDetails || {};
            
      const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

      presignedUrls.push({
        presignedUrl: presignedUrl,
        note: note,
        tags: tags,
      });
    }

    return presignedUrls;
  } catch (err) {
    console.log(err);
    throw err; 
  }
}

  