import {
    PROCESS_TRIP_STARTED,
    PROCESS_TRIP_FAILED,
    GET_TRIP_SUCCESS,
    SET_ACTIVE_TRIP
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
    switch (action.type) {
        case PROCESS_TRIP_STARTED:
            return {
                 ...state,
                 loading: true
            }
        case GET_TRIP_SUCCESS:
            return {
                ...state,
                loading: false,
                trips: action.payload
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
                trips: []
            }
        default:
            return state;
    }
}

export default tripsReducer;