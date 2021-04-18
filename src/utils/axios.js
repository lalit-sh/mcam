// import { API_URL } from "./config";
// import axios from 'axios';
// import AsyncStorage from "@react-native-community/async-storage";
// import {
//     ACCESS_TOKEN
// } from "./constants/common.constants";

// const baseURL = API_URL
// const axiosInstance = axios.create({
//     baseURL: baseURL,
//     headers: {
//         'Authorization': `JWT ${AsyncStorage.getItem(ACCESS_TOKEN)}`,
//         'Content-Type': 'application/json',
//         'accept': 'application/json'
//     }
// });


// axiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//         // const originalRequest = error.config;

//         // Prevent infinite loops
//         // if (error.response.status === 401 && originalRequest.url === baseURL+'token/refresh/') {
//         //     localStorage.removeItem("refresh_token");
//         //     localStorage.removeItem("access_token");
//         //     localStorage.removeItem("persist:root");
//         //     window.location.href = '/login/';
//         //     return Promise.reject(error);
//         // }

//         // if (error.response.data.code === "token_not_valid" &&
//         //     error.response.status === 401 && 
//         //     error.response.statusText === "Unauthorized") 
//         //     {
//         //         const refreshToken = localStorage.getItem('refresh_token');

//         //         if (refreshToken){
//         //             const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

//         //             // exp date in token is expressed in seconds, while now() returns milliseconds:
//         //             const now = Math.ceil(Date.now() / 1000);

//         //             if (tokenParts.exp > now) {
//         //                 return axiosInstance
//         //                 .post('/token/refresh/', {refresh: refreshToken})
//         //                 .then((response) => {
            
//         //                     localStorage.setItem('access_token', response.data.access);
//         //                     localStorage.setItem('refresh_token', response.data.refresh);
            
//         //                     axiosInstance.defaults.headers['Authorization'] = "Bearer " + response.data.access;
//         //                     originalRequest.headers['Authorization'] = "Bearer " + response.data.access;
            
//         //                     return axiosInstance(originalRequest);
//         //                 })
//         //                 .catch(err => {
//         //                     console.log(err)
//         //                 });
//         //             }else{
//         //                 console.log("Refresh token is expired", tokenParts.exp, now);
//         //                 window.location.href = '/login/';
//         //             }
//         //         }else{
//         //             console.log("Refresh token not available.")
//         //             window.location.href = '/login/';
//         //         }
//         // }
      
     
//       // specific error handling done elsewhere
//       return Promise.reject(error);
//   }
// );

// export default axiosInstance;