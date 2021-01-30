

import * as service from "../services/users.service";
import { getToken } from "../../utils/helpers/getStateHelpers";
import { START_LOADING, STOP_LOADING } from "../../utils/constants/common.constants";
import { UNKOWN_ERROR, CLEAR_ERROR } from "../../utils/constants/error.constants";
import { GET_USER_CONTACT_SUCCESS, GET_USER_CONTACT_FAILURE, SYNC_USER_CONTACTS } from "../../utils/constants/user.constants";

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

export const syncUserContacts = (con) => (dispatch, getState) => {
    dispatch(startLoading());
    service.syncUserContacts(con, getToken(getState))
    .then(resp => {
        if( resp && resp.data){
            let c=con.map(el => {
                el["isActive"] = false;
                if(resp.data.some(l => l == el)) el["isActive"] = true;
                return el;
            })
            dispatch({
                type: SYNC_USER_CONTACTS,
                payload: c 
            });
        }else if(resp.data.message){
            dispatch(failure(resp.data.message));
        }
    })
    .catch(err => {
        console.log(err);
        dispatch(failure(UNKOWN_ERROR));
    });
}




