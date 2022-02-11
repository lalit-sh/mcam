import { API_URL } from "../../utils/config";
import Axios from "axios";
import { getAuthToken } from "../../utils/helpers/commonHelpers";

export const syncUserContacts = (con, token) => {
    let url = `${API_URL}users/contacts`;
    return Axios({
        method: "post",
        url: url,
        data: {contacts: con},
        headers: {
            "accept": "Appication/json",
            "Authorization": token
        }
    });
}

export const updateFcmToken = async (token) => {
    let url = `${API_URL}users/updateFCMToken`;
    let authToken = await getAuthToken();
    return Axios({
        method: "post",
        url: url,
        data: {token: token},
        headers: {
            "accept": "Appication/json",
            "Authorization": authToken
        }
    });
}