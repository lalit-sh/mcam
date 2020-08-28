import { API_URL } from "../../utils/config";
import Axios from "axios";

export const getUserContacts = (token) => {
    let url = `${API_URL}users/contacts`;
    return Axios({
        method: "GET",
        url: url,
        headers: {
            "accept": "Appication/json",
            "Authorization": token
        }
    });
}
