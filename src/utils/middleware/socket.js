import socket from "socket.io-client";
import { SERVER_URL } from "../config";
import { NEW_IMAGE } from "../constants/socket.constants";

const SocketIO = socket(SERVER_URL, {
        transports: ['websocket'], 
        jsonp: false 
});

SocketIO.connect(); 
SocketIO.on('connect', () => { 
      console.log('connected to socket server'); 
});


export const newEvent = (eventName, params) => {
      if(!eventName)
            return false;
      SocketIO.emit(eventName, params);
      return true;
}

export const newImageEvent = (filename, url, trip) => {
      if(!filename || !url || !trip || !trip.members || trip.members.length < 1){
            return false;
      }
      return newEvent(NEW_IMAGE, {
            url: url,
            members: trip.members,
            trip: trip.name,
            username: trip.username,
            key: filename
      });
}

export default SocketIO;