import { 
    LATEST_IMAGE,
    GALLERY_IMAGE_READ,
    REMOVE_GALLERY_IMAGE 
} from "../../utils/constants/app.constant";
import { START_LOADING } from "../../utils/constants/common.constants";
import { 
    LOGOUT
} from "../../utils/constants/identity.constants";
const initialState = {
    loading: false,
    latestImage: false
};

const AppReducer = (state = initialState, action) => {
    let gallery, latestImage, index;
    let payload = action.payload;
    switch(action.type){
        case START_LOADING:
            return {
                ...state,
                loading: true
            }
        case LOGOUT:
            return {
                ...state,
                latestImage: null
            }
        case LATEST_IMAGE:
            gallery = state.gallery || {}
            if(!state.gallery[action.payload.group])
                state.gallery[action.payload.group] = []
            
            state.gallery[action.payload.group].push({
                path: action.payload.localUri
            })
            return {
                ...state,
                latestImage: action.payload.localUri,
                gallery: gallery
            }
        case GALLERY_IMAGE_READ:
            latestImage = state.latestImage;
            if(Object.keys(action.payload) && 
                Object.keys(action.payload).length > 0 &&  
                action.payload[Object.keys(action.payload)[0]] &&
                action.payload[Object.keys(action.payload)[0]].length > 0 &&
                !latestImage){
                latestImage = action.payload[Object.keys(action.payload)[0]][0]["path"];
            }
            return {
                ...state,
                gallery: action.payload,
                loading: false,
                latestImage: latestImage,
                galleryLastSyncTime: new Date().toISOString()
            }
        case REMOVE_GALLERY_IMAGE: 
            gallery = state.gallery;
            latestImage = state.latestImage;
            if(gallery[payload.group]){
                index = gallery[payload.group].findIndex(el => el.path == payload.path)
                if(index !== -1){
                    gallery[payload.group].splice(index, 1)
                    if(payload.path == latestImage){
                        latestImage = gallery[payload.group][0]
                    }
                }
            }

            return {
                ...state,
                latestImage,
                gallery,
                loading: false
            }

        default:
            return state;
    }
};

export default AppReducer;