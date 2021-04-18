import { handleNewDataMessage } from "./helpers/Notification.helpers";

export const firebaseBackgroundMessage = async (store,message) => { 
    handleNewDataMessage(message, store.getState);
    return Promise.resolve(); 
}