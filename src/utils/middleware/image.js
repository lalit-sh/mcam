import AWS from 'aws-sdk';
import {  S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_OBJECT_PATH } from "../config";
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";

var S3 = new AWS.S3({
    region: "us-west-2",
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    }
});

export default S3;

export const uploadImage = async (filePath, fileName, onProgress, onSuccess) => {
    try{
        const base64 = await fs.readFile(filePath, "base64");
        const arrayBuffer = decode(base64);

        const params = {
            Bucket: S3_BUCKET_NAME,
            Body: arrayBuffer,
            ContentType: "image/jpeg",
            Key: S3_OBJECT_PATH+"/"+fileName,
            acl: 'private'
        };
        return S3.upload(params).on("httpUploadProgress", onProgress ? onProgress : (evt) => {
            //getProgress
        })
        .send(onSuccess ? onSuccess : (error, data) => {
            // get success result
        });;
    }catch(error){
        console.log("error", error);
    }

}