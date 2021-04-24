import firebase from 'react-native-firebase';
import { 
    downloadImage
} from "../middleware/image";
import { 
    getAppStoragePath,
} from "./localStorageHelpers";
import PushNotification from "../PushNotification";
import { store }  from "../../redux/store/index";
import { S3_OBJECT_PATH } from "../../utils/config";

var getState = store.getState 
const androidChannelName = PushNotification.getChannel();

const newImageMessage = (data) => {
    const notification = showNewImageNotification(data);
    const storagePath = getAppStoragePath(data.group);
    let key = data.imageKey;
    key = key.replace(`${S3_OBJECT_PATH}/`, "sh_");
    const fullFilePath = `${storagePath}/${key}`;
    downloadImage(data.imageKey, fullFilePath, (progress) => updateProgressToNotification(notification, progress));
}

const addedToGroupMessage = (data) => {
    const notification = showNewUserAddedToGroupNotification(data);
    return notification;
}

const getSenderName = (data) => {
    const state = getState();
    const contacts = state && state.users && state.users.contacts;
    let senderName = contacts && contacts[data.sender || data.username] || data.sender || data.username || "User";
    return senderName;
}

const newNotification = (id, title, body="") => {
    const noti = new firebase.notifications.Notification()
                                    .setNotificationId(id)
                                    .setTitle(title)
                                    .setBody(body);
    return noti;
}

const displayNotification = (notification) => {
    notification
    .android.setChannelId(androidChannelName.id)
    .android.setSmallIcon('ic_launcher');
    firebase.notifications().displayNotification(notification);
}

export const handleNewDataMessage = (message, gs) => {
    try{
        if(gs)
            getState = gs;
        if(message){
            let data = message.data;
            if(data.type && data.type == 'ADDED_USER_TO_GROUP'){
                return addedToGroupMessage(data);
            }

            if(data.type && data.type == 'NEW_IMAGE_RECEIVED'){
                return newImageMessage(data)
            }
        }
    }catch(err){
        console.log("Error: Error in handleNewDataMessage", err)
    }
}

export const updateProgressToNotification = (notification, progress, onCompleteText='Downloaded') => {
    try{
        notification.android.setOnlyAlertOnce(true)
        if(progress == 100){
            notification.setBody(onCompleteText);
        }
        notification.android.setProgress(100, progress, false)
        firebase.notifications().displayNotification(notification);
    }catch(err){
        console.log("Error: Error in updateProgressToNotification", err)
    }
}

export const showNewImageNotification = (data, props = {}) => {
    try{
        const senderName = getSenderName(data);
        const newImageNotification  = newNotification('NEW_IMAGE_RECEIVED', `${senderName} shared new image in ${data.group} group`, 'Downloading');
        displayNotification(newImageNotification)
        return newImageNotification;
    }catch(err){
        console.log("Error: Error in showNewImageNotification", err)
    }
}

export const showUploadImageNotification = (activeTrip) => {
    try{
        const activeMembers = activeTrip.members.length - 1; //one less for self
        const newImageNotification = newNotification('NEW_IMAGE_UPLOAD', `Sharing image with ${activeMembers} peoples.`, 'Uploading');
        displayNotification(newImageNotification)
        return newImageNotification;
    }catch(err){
        console.log("Error: Error at showUploadImageNotification", err);
    }
}

export const showNewUserAddedToGroupNotification = (data) => {
    try{
        const senderName = getSenderName(data);
        const notification = newNotification("USER_ADDED_TO_GROUP", `${senderName} added you to "${data.groupName}" group`) 
        displayNotification(notification);
        return notification;
    }catch(err){
        console.log("Error: Error at showNewUserAddedToGroupNotification", err);
    }
}

export const removeNotification = notification_id => {
    try{
        firebase.notifications().removeDeliveredNotification(notification_id);
    }catch(err){
        console.log("Error: Error at removeNotification", err);
    }
}