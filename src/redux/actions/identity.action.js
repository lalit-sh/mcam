import { 
            AUTH_STARTED, 
            AUTH_FAILED, 
            AUTH_SUCCESS,  
            CLEAR_ERROR,
            LOGOUT
        } from "../../utils/constants/identity.constants";
import {
    ACCESS_TOKEN
} from "../../utils/constants/common.constants";
import { 
            UNKOWN_ERROR
        } from "../../utils/constants/error.constants";
import * as service from "../services/identity.service";
import AsyncStorage from "@react-native-community/async-storage";

const authSuccess = payload => {
    return ({
        type: AUTH_SUCCESS,
        payload: payload
    })
};

const authFailed = payload => ({
    type: AUTH_FAILED,
    payload: payload
});

const authStarted = payload => ({
    type: AUTH_STARTED,
    payload: payload
});

export const authenticate = (username, password) => dispatch => {
    dispatch(authStarted());
    service.authenticate(username, password)
    .then(async resp => {
        if(resp && resp.data && resp.data.token){
            await AsyncStorage.setItem(ACCESS_TOKEN, resp.data.token);
            dispatch(authSuccess(Object.assign({}, resp.data, {username})));
        }else{
            dispatch(authFailed(resp.data.message))
        }
    })
    .catch(err => {
        let message = err.response?.data?.message || UNKOWN_ERROR
        dispatch(authFailed(message))
    });
}

export const clearError = () => (dispatch) => {
    dispatch({type: CLEAR_ERROR})
}

export const logout = () => async (dispatch) => {
    dispatch({type: LOGOUT});
}