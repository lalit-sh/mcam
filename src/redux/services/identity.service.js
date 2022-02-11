import axios from "axios";
import { API_URL } from "../../utils/config";

export const authInit = username => {
    return axios.post(`${API_URL}auth/init/`, {
        "username": username
    }, {
        timeout: 6000
    });
}

export const authenticate = (username, otp) => {
    return axios.post(`${API_URL}auth/login`, {
        "username": username,
        "password": otp
    });
}