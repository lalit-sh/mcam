import { LATEST_IMAGE, GALLERY_IMAGE_READ, REMOVE_GALLERY_IMAGE } from "../../utils/constants/app.constant";
import fs from "react-native-fs";
import { 
    getAppStoragePath,
    createAppDir,
} from  '../../utils/helpers/localStorageHelpers';
import { START_LOADING } from "../../utils/constants/common.constants";

export const updateLatestImageTaken = (localUri) => (dispatch) => {
    dispatch({
        type: LATEST_IMAGE,
        payload: localUri
    })
}

const startLoading = () => {
    return {
        type: START_LOADING
    } 
}

export const syncGalleryImages = () => async dispatch => {
    try{
        dispatch(startLoading())
        const storagePath = getAppStoragePath();
        let d = {};
        let dirs = await fs.readDir(storagePath);
        if(dirs && dirs.length > 0){
            for(let el of dirs){
                let f = await fs.readDir(el.path);
                f = f.filter(fl => fl.isFile() && fl.name.match(/.(jpg|jpeg)$/i))
                    .sort((a, b) => new Date(b.mtime) - new Date(a.mtime))
                if(f && f.length > 0)
                    d[el.name] = f;
            }
        }
        dispatch({
            type: GALLERY_IMAGE_READ,
            payload: d
        })
    }catch(err){
        console.log("Error in syncGalleryImages in app actions", err);
        if(err.message == 'Folder does not exist')
            createAppDir()
        dispatch({
            type: GALLERY_IMAGE_READ,
            payload: {}
        })
    }
}

export const removeGalleryImage = (group, path) => d => {
    d({
        type: REMOVE_GALLERY_IMAGE,
        payload: {group, path}
    })
}