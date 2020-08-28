import axios from "axios";
import { API_URL } from "../../utils/config";


export const createTrip = (tripName, token) => {
        let url = `${API_URL}trips`;
        return axios({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            data: {
                "name": tripName
            }
        });
}

export const updateTrip = (tripName, data, token) => {
    let url = `${API_URL}trips`;
    return axios({
        method: "PUT",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        data: {
            "tripName": tripName,
            "data": data
        }
    });
}

export const getTrips = (tripName, token) => {
    let url = `${API_URL}trips`;
    return axios({
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        query: {
            "tripName": tripName,
        }
    });
}

export const deleteTrip = (trips, token) => {
    let url = `${API_URL}trips`;
    return axios({
        method: "DELETE",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        data: {
            "trips": trips
        }
    });
}

export const markTripActive = (trip, token) => {
    let url = `${API_URL}trips/mark_active?n=${trip}`;
    return axios({
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        }
    });
}
