

import * as service from "../services/users.service";
import { getToken } from "../../utils/helpers/getStateHelpers";
import { START_LOADING, STOP_LOADING } from "../../utils/constants/common.constants";
import { UNKOWN_ERROR, CLEAR_ERROR } from "../../utils/constants/error.constants";
import { GET_USER_CONTACT_SUCCESS, GET_USER_CONTACT_FAILURE } from "../../utils/constants/user.constants";

const startLoading = payload => ({
    type: START_LOADING
});

const stopLoading = payload => ({
    type: STOP_LOADING
});

const success = payload => ({
    type: GET_USER_CONTACT_SUCCESS,
    payload: payload
});

const failure = payload => ({
    type: GET_USER_CONTACT_FAILURE,
    payload: payload
});

export const clearError = () => dispatch => {
    dispatch({
        type: CLEAR_ERROR
    });
}


export const updateProfile = () => (dispatch, getState) =>{

}

export const getProfile = () => (dispatch, getState) =>{

}

export const saveUserContacts = () => (dispatch, getState) => {
    
}

export const getUserContacts = () => (dispatch, getState) => {
    dispatch(startLoading());
    service.getUserContacts(getToken(getState))
    .then(resp => {
        if( resp && resp.data){
            dispatch(success(resp.data));
        }else if(resp.data.message){
            dispatch(failure(resp.data.message));
        }
    })
    .catch(err => {
        dispatch(failure(UNKOWN_ERROR));
    });
}




