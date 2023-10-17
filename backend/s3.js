import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import fs from 'fs';
import {config} from "dotenv";

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

export const uploadFile = async (buffer, filename, mimetype) => {

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: filename,
            Body: buffer,
            ContentType: mimetype,
          });
        

        return s3.send(command)
        .then((data)=>{
            console.log("File uploaded successfully")
            const fileUrl = `https://${bucket}.s3.amazonaws.com/${filename}`;
            return fileUrl;
        })
        .catch((err)=>{
            console.error("Error uploading file",err)
        })
    // })  

    // return Promise.all(uploadPromises);
    
}