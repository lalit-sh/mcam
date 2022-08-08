import RNFS from "react-native-fs"; 
import { PermissionsAndroid } from "react-native";
import RNExitApp from 'react-native-exit-app';
import moment from "moment";

import * as config from "../config";


export const getStoragePermission = async () => {
    try{
        const isPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if(!isPermission){
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                RNExitApp.exitApp(); 
                return false;
            }
        }
        return true;
    }catch(err){
        console.log("Error while requesting storage permission.");
        return false;
    } 
}

export const getStoragePath = () => {
    // returns '/storage/emulated/0';
    return RNFS.ExternalStorageDirectoryPath;
}

export const getAppStoragePath = (p) => {
    let x = `${getStoragePath()}/${config.LOCAL_STORAGE_PATH}`;
    if(p)
        return `${x}/${p}`;
    return x;
}

export const createAppDir = async () => {
    let path = `${getStoragePath()}/${config.LOCAL_STORAGE_PATH}`;
    return upsertDirectory(path);
}

export const upsertDirectory = async (path) => {
    try{
        let isDirectroryExist = await isDirectroryExists(path);
        if(!isDirectroryExist){
            await RNFS.mkdir(path);
        }
        return true;
    }catch(error){
        console.log(`Error while upserting directory ${path}`, error);
        return false;
    }
}

export const isDirectroryExists = async (path) => {
    try{
        return await RNFS.exists(path);
    }catch(error){
        console.log("Error at isDirectroryExists", error);
        return false;
    }
}

export const getFileName = () => {
    return `MZ_${moment().format("YYYYMMDD_HHmmss")}.jpg`;
}

export const stripFilePathPrefix = (pathStr) => {
    if (pathStr.startsWith('file://')) return pathStr.replace(/^file:\/\//, '');
    return pathStr;
}

export const moveFile = async (frompPath, toPath) => {
    try{
        return await RNFS.moveFile(stripFilePathPrefix(frompPath), toPath);
    }catch(err){
        console.log(`Error while moving the file from ${frompPath} to ${toPath}`, err);
    }
}

export const removeFiles = async (files = []) => {
    try{
        if(files && Array.isArray(files)){
            for(let el of files){
                let exist = await isDirectroryExists(el); 
                if(exist){
                    await RNFS.unlink(el);
                }
            }
        }
        return true;
    }catch(err){
        console.log("Error while deleting file ", err);
        return false;
    }
}

export const removeFile = async (filePath) => {
    try{
        let exist = await isDirectroryExists(filePath); 
        if(exist){
            await RNFS.unlink(filePath);
            return true;
        }
        return false;
    }catch(err){
        console.log("Error while deleting file ", err);
        return false;
    }
}