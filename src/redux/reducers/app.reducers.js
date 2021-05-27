import { 
    LATEST_IMAGE,
    GALLERY_IMAGE_READ
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
            return {
                ...state,
                latestImage: action.payload,
            }
        case GALLERY_IMAGE_READ:
            return {
                ...state,
                gallery: action.payload,
                loading: false
            }
        default:
            return state;
    }
};

export default AppReducer;