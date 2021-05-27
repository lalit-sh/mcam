import {
    PROCESS_TRIP_STARTED,
    PROCESS_TRIP_FAILED,
    GET_TRIP_SUCCESS,
    SET_ACTIVE_TRIP,
    NEW_GROUP_ADDED
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
    let trips, activeTrip;
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
        default:
            return state;
    }
}

export default tripsReducer;