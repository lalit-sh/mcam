import {
    CLEAR_ERROR
} from "../../utils/constants/error.constants";
import {
    LOGOUT
} from "../../utils/constants/identity.constants";
import { TOGGLE_GRID } from "../../utils/constants/settings.constants";


const initialState = {
    grid: false,
    loading: false
};


const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        case LOGOUT:
            return {
                ...state,
                grid: false
            }
        case TOGGLE_GRID:
            return {
                ...state,
                grid: !state.grid
            }
        default:
            return state;
    }
}

export default settingsReducer;