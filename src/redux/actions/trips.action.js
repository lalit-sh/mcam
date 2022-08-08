import {
    PROCESS_TRIP_STARTED,
    PROCESS_TRIP_FAILED,
    GET_TRIP_SUCCESS,
    SET_ACTIVE_TRIP,
    NEW_GROUP_ADDED
} from "../../utils/constants/trips.constant";
import { 
    CLEAR_ERROR
} from "../../utils/constants/error.constants";
import * as service from "../services/trips.services";
import { getToken } from "../../utils/helpers/getStateHelpers";

const started = payload => ({
    type: PROCESS_TRIP_STARTED
});

const failure = payload => ({
    type: PROCESS_TRIP_FAILED,
    payload: payload
});

const success = payload => ({
    type: GET_TRIP_SUCCESS,
    payload: payload
})

const setActiveTrip = payload => ({
    type: SET_ACTIVE_TRIP,
    payload: payload
})

export const clearError = () => dispatch => {
    dispatch({
        type: CLEAR_ERROR
    });
}

export const createTrip = (tripName) => (dispatch, getState) =>  {
    dispatch(started());
    service.createTrip(tripName, getToken(getState))
    .then(resp => {
        if(resp && resp.data && !resp.data.message){
            dispatch({
                type: NEW_GROUP_ADDED,
                payload: resp.data
            })
            // getTrips()(dispatch, getState)
        }else{
            let message = resp.data.message;
            if(message && message.includes("duplicate key error collection")){
                message = `Trip "${tripName}" already exsit.`
            }
            dispatch(failure(message));
        }
    })
    .catch(err => {
        dispatch(failure("Something went wrong"));
    })
};

export const updateTrip = (tripName, data) => (dispatch, getState) => {
    dispatch(started());
    service.updateTrip(tripName, data, getToken(getState))
    .then(resp => {
        if(resp && resp.data){
            getTrips()(dispatch, getState);;
        }else{
            dispatch(failure(resp.data.message));
        }
    })
    .catch(err => {
        dispatch(failure("Something went wrong"));
    })
};

export const manageMembersToGroup = ({groupId, groupName, member, addMember}) => (dispatch, getState) => {
    dispatch(started());
    service.manageMembersToGroup({groupName, member, addMember, groupId}, getToken(getState))
    .then(resp => {
        if(resp && resp.data){
            getTrips()(dispatch, getState);;
        }else{
            dispatch(failure(resp.data && resp.data.message || "Something went wrong"));
        }
    })
    .catch(err => {
        console.log('Error in manageMembersToGroup', err, err.response)
        dispatch(failure("Something went wrong"));
    })
}

export const getTrips = (tripName = null) => (dispatch, getState) => {
    dispatch(started());
    service.getUserTrips(getToken(getState))
    .then(resp => {
        if(resp && resp.data){
            dispatch(success(resp.data));
        }else{
            dispatch(failure(resp.data.message));
        }
    })
    .catch(err => {
        console.log("error getTrips", err);
        dispatch(failure("Something went wrong"));
    })
};

export const deleteGroup = (id) => (dispatch, getState) => {
    dispatch(started());
    service.deleteTrip(id, getToken(getState))
    .then(resp => {
        if(resp && resp.data){
            getTrips()(dispatch, getState);;
        }else{
            dispatch(failure(resp.data.message));
        }
    })
    .catch(err => {
        dispatch(failure("Something went wrong"));
    })
};

export const markTripActive = (trip) => (dispatch, getState) => {
    dispatch(setActiveTrip(trip));
    // setActiveTripToStorage(trip);
}

export const shareImageWithGroup = (data) => (dispatch, getState) => {
    service.shareNewImage(data, getToken(getState))
    .then(resp => {
        console.log("Image shared with group", resp);
    })
    .catch(err => {
        console.log("error in shareImageWithGroup", err);
    })
} 

// const setActiveTripToStorage = async trip => {
//     try{
//         await AsyncStorage.setItem('ACTIVE_TRIP', JSON.stringify(trip));
//     }catch(err){
//         console.log("err", err);
//     }
// }