import axios from "axios";
import { API_URL } from "../../utils/config";

export const login = (username, password) => {
    let url = `${API_URL}auth/login`;
    console.log("url", url)
    return axios({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            "username": username,
            "password": password
        }
    });
}

export const signup = ({username, password, name, deviceId}) => {
    let url = `${API_URL}auth/signup`;
    return axios({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            "username": username,
            "password": password,
            "name": name,
            "deviceId": deviceId
        }
    });
}