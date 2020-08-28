import { 
            AUTH_STARTED, 
            AUTH_FAILED, 
            AUTH_SUCCESS,  
            CLEAR_ERROR,
            LOGOUT
        } from "../../utils/constants/identity.constants";
import { 
            UNKOWN_ERROR
        } from "../../utils/constants/error.constants";
import * as service from "../services/identity.service";

const authSuccess = payload => ({
    type: AUTH_SUCCESS,
    payload: payload
});

const authFailed = payload => ({
    type: AUTH_FAILED,
    payload: payload
});

const authStarted = payload => ({
    type: AUTH_STARTED,
    payload: payload
});

export const login = (username, password) => dispatch => {
    dispatch(authStarted());
    service.login(username, password)
    .then(resp => {
        if(resp && resp.data && resp.data.token){
            dispatch(authSuccess(Object.assign({}, resp.data, {username})));
        }else{
            dispatch(authFailed(resp.data.message))
        }
    })
    .catch(err => {
        dispatch(authFailed(UNKOWN_ERROR))
    });
}

export const signup = ({username, password, name, deviceId}) => dispatch => {
    dispatch(authStarted());
    service.signup({username, password, name, deviceId})
    .then(resp => {
        if(resp && resp.data && resp.data.token){
            dispatch(authSuccess(Object.assign({}, resp.data, {username})));
        }else{
            dispatch(authFailed(resp.data.message))
        }
    })
    .catch(err => dispatch(authFailed(UNKOWN_ERROR)));
}

export const clearError = () => (dispatch) => {
    dispatch({type: CLEAR_ERROR})
}

export const logout = () => (dispatch) => {
    dispatch({type: LOGOUT});
}