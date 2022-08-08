

import * as service from "../services/users.service";
import { getToken } from "../../utils/helpers/getStateHelpers";
// import { START_LOADING, STOP_LOADING } from "../../utils/constants/common.constants";
import { UNKOWN_ERROR, CLEAR_ERROR } from "../../utils/constants/error.constants";
import { 
    GET_USER_CONTACT_SUCCESS, 
    GET_USER_CONTACT_FAILURE, 
    SYNC_USER_CONTACTS, 
    USER_START_LOADING,
    USER_STOP_LOADING
} from "../../utils/constants/user.constants";

const startLoading = payload => ({
    type: USER_START_LOADING
});

const stopLoading = payload => ({
    type: USER_STOP_LOADING
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

export const syncUserContacts = (con) => (dispatch, getState) => {
    dispatch(startLoading());
    service.syncUserContacts(Object.keys(con), getToken(getState))
    .then(resp => {
        if( resp && resp.data){
            let d = {};

            resp.data.map(el => {
                d[el.username] = con[el.username]
            });

            dispatch({
                type: SYNC_USER_CONTACTS,
                payload: d
            });
        }else if(resp.data.message){
            dispatch(failure(resp.data.message));
        }
    })
    .catch(err => {
        console.log("Error while syncing user contacts in user action syncUserContacts",err);
        dispatch(failure(UNKOWN_ERROR));
    });
}

export const updateFcmToken = (fcmToken) => (dispatch) => {
    // dispatch(startLoading());
    service.updateFcmToken(fcmToken)
    .then(resp => {
        // if(resp){
        //     console.log("success", resp);
        // }else{

        // }
    })
    .catch(err => {
        console.log("Error while updating FCM token",err);
    })
}



