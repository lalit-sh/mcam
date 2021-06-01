import { TOGGLE_GRID, UPDATE_SETTING } from '../../utils/constants/settings.constants';

export const toggleGrid = () => (dispatch) => {
    dispatch({
        type: TOGGLE_GRID
    })
}

export const updateSettings = (key, value) => dispatch => {
    dispatch({
        type: UPDATE_SETTING,
        payload: {
            key,
            value
        }
    })
}