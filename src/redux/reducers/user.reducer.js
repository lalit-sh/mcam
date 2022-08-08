import { GET_USER_CONTACT_SUCCESS, GET_USER_CONTACT_FAILURE, SYNC_USER_CONTACTS, USER_START_LOADING, USER_STOP_LOADING} from '../../utils/constants/user.constants';
import { CLEAR_ERROR } from "../../utils/constants/error.constants";
import { LOGOUT } from "../../utils/constants/identity.constants";


const initialState = {
    profile: {},
    contacts: null,
    loading: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_START_LOADING:
            return {
                ...state,
                loading: true
            };
        case USER_STOP_LOADING:
            return {
                ...state,
                loading: false
            };
        case GET_USER_CONTACT_SUCCESS:
            return {
                ...state,
                contacts: action.payload,
                error: "",
                loading: false
            }
        case GET_USER_CONTACT_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: ""
            };
        case SYNC_USER_CONTACTS:
            return {
                ...state,
                error: "",
                contacts: action.payload,
                loading: false
            }
        case LOGOUT:
            return {
                ...state,
                error: null,
                contacts: null,
                loading: false
            }
        default:
            return state;
    }
}


export default userReducer;