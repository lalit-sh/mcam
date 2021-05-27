import { 
    AUTH_STARTED, 
    AUTH_FAILED, 
    AUTH_SUCCESS,
    CLEAR_ERROR,
    LOGOUT
} from "../../utils/constants/identity.constants";

const initialState = {
    isLoggedIn: false,
    loading: false
};

const identityReducer = (state = initialState, action) => {
    switch(action.type){
        case AUTH_STARTED:
            return {
                ...state,
                loading: true,
                error: null
            };
        case AUTH_FAILED:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        case AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoggedIn: true,
                user: action.payload.user,
                expires: action.payload.expires,
                token: action.payload.token,
                username: action.payload.username,
                error: null
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                expires: null,
                token: null,
                username: null,
                error: null
            }
        default:
            return state;
    }
};

export default identityReducer;