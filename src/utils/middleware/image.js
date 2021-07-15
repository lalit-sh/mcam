import RNBackgroundDownloader from 'react-native-background-downloader';
import RNBackgroundUploader from 'react-native-background-upload'
import AsyncStorage from "@react-native-community/async-storage";
import {
    ACCESS_TOKEN
} from "../../utils/constants/common.constants";
import { API_URL } from "../../utils/config";

export const uploadImage = async (options, onProgress) => {
    try{
        let { path, groupId, imageKey, activeMembers } = options
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        const params = {
            url: `${API_URL}upload_image`,
            path: path,
            method: 'POST',
            field: 'file',
            type: 'multipart',
            parameters: {
                groupId: groupId,
                imageKey: imageKey
            },
            headers:{
                Authorization: token
            },
            notification:{
                enabled: true, 
                onProgressTitle: `Sharing image with ${activeMembers} peoples.`, 
                onProgressMessage: "uploading...",
                autoClear: true
            }
        };

        RNBackgroundUploader.startUpload(params).then((uploadId) => {
            console.log('Upload started')
            RNBackgroundUploader.addListener('progress', uploadId, (data) => {
                onProgress && onProgress(data.progress)
            });
            // RNBackgroundUploader.addListener('error', uploadId, (data) => {
            //     console.log(`Error:`, data)
            //     onProgress && onProgress(null, data.error);
            // })
            // RNBackgroundUploader.addListener('cancelled', uploadId, (data) => {
            //     console.log(`Cancelled!`)
            // })
            // RNBackgroundUploader.addListener('completed', uploadId, (data) => {
            //     // data includes responseCode: number and responseBody: Object
            //     onProgress && onProgress(100);
            // })
        }).catch((err) => {
            console.log('Upload error!', err)
            onProgress && onProgress(null, err);
        });
    }catch(error){
        console.log("error", error);
    }
}
export const downloadImage = async (key, url, destination, onProgress) => {
    try{
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