import AWS from 'aws-sdk';
import {  S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_OBJECT_PATH } from "../config";
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import RNBackgroundDownloader from 'react-native-background-downloader';

var S3 = new AWS.S3({
    region: "us-east-2",
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

export const getSignedUrl = async (key) => {
    try{
        console.log("key", key)
        var params = {Bucket: S3_BUCKET_NAME, Key: key};
        let url = await S3.getSignedUrl('getObject', params);
        return url;
    }catch(err){
        console.log("Error while getSignedUrl ", err)
    }
}

export const downloadImage = async (key, destination, onProgress) => {
    try{
        let url = await getSignedUrl(key);
        console.log("Your signed url", url);
        RNBackgroundDownloader.download({
            id: key,
            url: url,
            destination: destination
        }).begin((expectedBytes) => {
            onProgress && onProgress(0)
            console.log(`Going to download ${expectedBytes} bytes!`);
        }).progress((percent) => {
            onProgress && onProgress(percent * 100)
            console.log(`Downloaded: ${percent * 100}%`);
        }).done(() => {
            onProgress && onProgress(100)
            console.log('Download is done!');
        }).error((error) => {
            console.log('Download canceled due to error: ', error);
        });
    }catch(error){
        console.log("error", error);
    }
}