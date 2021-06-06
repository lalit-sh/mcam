import {
    CLEAR_ERROR
} from "../../utils/constants/error.constants";
import {
    LOGOUT
} from "../../utils/constants/identity.constants";
import { UPDATE_SETTING } from "../../utils/constants/settings.constants";


const initialState = {
    grid: false,
    loading: false,
    imageQuality: 0.5,
    previewTime: 3,
    captureSound: true
};


const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        case LOGOUT:
            return {
                ...state,
                grid: false
            }
        case UPDATE_SETTING:
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        default:
            return state;
    }
}

export default settingsReducer;