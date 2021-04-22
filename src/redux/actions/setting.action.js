import { TOGGLE_GRID } from '../../utils/constants/settings.constants';
export const toggleGrid = () => (dispatch) => {
    dispatch({
        type: TOGGLE_GRID
    })
}