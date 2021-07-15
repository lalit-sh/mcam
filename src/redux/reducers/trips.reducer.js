import {
    PROCESS_TRIP_STARTED,
    PROCESS_TRIP_FAILED,
    GET_TRIP_SUCCESS,
    SET_ACTIVE_TRIP,
    NEW_GROUP_ADDED,
    USER_ADDED_TO_GROUP,
    GROUP_DELETED,
    USER_REMOVED_TO_GROUP,
    USER_LEFT_GROUP
} from "../../utils/constants/trips.constant";
import { 
    LOGOUT
} from "../../utils/constants/identity.constants";

import { 
    CLEAR_ERROR
} from "../../utils/constants/error.constants";

const initialState = { 
    trips: [],
    loading: false
};


const tripsReducer = (state = initialState, action) => {
    let trips, activeTrip, index;
    switch (action.type) {
        case PROCESS_TRIP_STARTED:
            return {
                ...state,
                loading: true
            }
        case GET_TRIP_SUCCESS:
            activeTrip = state.activeTrip;
            trips = [...action.payload];
            if(activeTrip && activeTrip._id){
                activeTrip = trips.find(el => el._id == activeTrip._id);
            }

            return {
                ...state,
                loading: false,
                trips: trips,
                activeTrip: activeTrip || null
            }
        case PROCESS_TRIP_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        case SET_ACTIVE_TRIP:
            return {
                ...state,
                activeTrip: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                activeTrip: null,
                trips: [],
                loading: false
            }
        case NEW_GROUP_ADDED:
            trips = [], activeTrip = state.activeTrip;
            if(!state.trips || state.trips.length == 0)
                activeTrip = action.payload;
            if(state.trips && state.trips.length)
                trips = [...state.trips]
            trips.push(action.payload)

            return {
                ...state,
                trips: trips,
                activeTrip: activeTrip,
                loading: false
            }
        case USER_ADDED_TO_GROUP:
            trips = [...state.trips]
            index = trips.findIndex(el => el._id == action.payload._id);
            if(index !== -1){
                console.log("trips[index].members", trips[index].members, action.payload.updatedMember)
                trips[index].members = trips[index].members.filter(el => el.username !== action.payload.updatedMember);
                trips[index].members.push({username: action.payload.updatedMember})
            }
            if(state.activeTrip && state.activeTrip._id == action.payload._id){
                activeTrip = {...state.activeTrip}
                activeTrip = trips[index];
            }
            return {
                ...state,
                trips: trips,
                activeTrip: activeTrip,
                loading: false
            }
        case USER_REMOVED_TO_GROUP:
            trips = [...state.trips]
            index = trips.findIndex(el => el._id == action.payload._id);
            if(index !== -1){
                trips[index].members = trips[index].members.filter(el => el.username !== action.payload.updatedMember);
            }
            if(state.activeTrip && state.activeTrip._id == action.payload._id){
                activeTrip = null
            }
            return {
                ...state,
                trips: trips,
                activeTrip: activeTrip,
                loading: false
            }
        case USER_LEFT_GROUP: 
            trips = [...state.trips]
            index = trips.findIndex(el => el._id == action.payload._id);
            if(index !== -1){
                trips[index].members =  trips[index].members.filter(el => el.username !== action.payload.updatedMember);
            }
            return {
                ...state,
                trips: trips,
                loading: false
            }
        case GROUP_DELETED:
            trips = [...state.trips]
            trips = trips.filter(el => el._id !== action.payload._id);
            activeTrip = state.activeTrip
            if(activeTrip && activeTrip._id == action.payload._id){
                activeTrip = null;
            }

            return {
                ...state,
                trips: trips,
                activeTrip: activeTrip,
                loading: false
            }
        default:
            return state;
    }
}

export default tripsReducer;