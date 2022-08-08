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
import { USER_ADDED_TO_GROUP, USER_REMOVED_TO_GROUP, USER_LEFT_GROUP, GROUP_DELETED } from '../constants/trips.constant';
import { getTrips } from "../../redux/actions/trips.action";

var getState = store.getState 
const androidChannelName = PushNotification.getChannel();


const getSenderName = (data) => {
    const state = getState();
    const contacts = state && state.users && state.users.contacts;
    let senderName = contacts && contacts[data.sender || data.username] || data.sender || data.username || "User";
    return senderName;
}

const getUserName = () => {
    const state = getState();
    const username = state?.identity?.username;
    return username;
}

const getActiveGroup = () => {
    const state = getState();
    const activeGroup = state?.trips?.activeTrip;
    return activeGroup;
}


export const createNotification = (id, title, body="") => {
    const notification = new firebase.notifications.Notification()
                                    .setNotificationId(id)
                                    .setTitle(title)
                                    .setBody(body);
    return notification;
}

export const displayNotification = (notification,) => {
    notification
    .android.setChannelId(androidChannelName.id)
    .android.setSmallIcon('@mipmap/ic_stat_ic_notification')
    .android.setColor("red")
    firebase.notifications().displayNotification(notification);
}

export const handleNewDataMessage = async (message, gs) => {
    try{
        if(gs)
            getState = gs;
        if(message){
            let data = message.data;
            let eventName = data.type;
            switch (eventName) {
                case "ADDED_USER_TO_GROUP":
                    await userAddedToGroup(data);
                    break;
                case "REMOVED_USER_TO_GROUP":
                    await userRemovedFromGroup(data);
                    break;
                case "USER_LEFT_GROUP":
                    await userLeftGroup(data);
                    break;
                case "GROUP_DELETED":
                    await groupDeleted(data);
                    break;
                case "NEW_IMAGE_RECEIVED":
                    await newImageReceived(data);
                    break;
                default:
                    console.log("An unhandled event happend", data);
                    break;
            }
        }
    }catch(err){
        console.log("Error: Error in handleNewDataMessage", err)
    }
}


const userAddedToGroup = async (data) => {
    try{
        const senderName = getSenderName(data);
        const updatedUserName = data.updatedUserName;
        if(updatedUserName == getUserName()){
            const notification = createNotification("USER_ADDED_TO_GROUP", `${senderName} added you to "${data.groupName}" group`) 
            displayNotification(notification);
            getTrips()(store.dispatch, getState)
        }else{
            store.dispatch({
                type: USER_ADDED_TO_GROUP,
                payload: {
                    _id: data.groupId,
                    updatedMember: updatedUserName  
                }
            })
        }
    }catch(err){
        console.log("An error occured in Notification.helpers.js at userAddedToGroup: ", err);
    }
}

const userRemovedFromGroup = async (data) => {
    try{
        const senderName = getSenderName(data);
        const updatedUserName = data.updatedUserName;
        if(updatedUserName == getUserName()){
            const notification = createNotification("USER_REMOVED_FROM_GROUP", `${senderName} removed you from "${data.groupName}" group`); 
            displayNotification(notification);
            getTrips()(store.dispatch, getState)
        }else{
            store.dispatch({
                type: USER_REMOVED_TO_GROUP,
                payload: {
                    _id: data.groupId,
                    updatedMember: updatedUserName  
                }
            })
        }
    }catch(err){
        console.log("An error occured in Notification.helpers.js at userRemovedFromGroup: ", err);
    }
}

const userLeftGroup = async (data) => {
    try{
        store.dispatch({
            type: USER_LEFT_GROUP,
            payload: {
                _id: data.groupId,
                updatedMember: updatedUserName  
            }
        })
    }catch(err){
        console.log("An error occured in Notification.helpers.js at userLeftGroup: ", err);
    }
}

const groupDeleted = async (data) => {
    try{
        const senderName = getSenderName(data);
        const activeGroup = getActiveGroup();
        if(activeGroup && activeGroup._id == data.groupId){
            const notification = createNotification("GROUP_DELETED", `${senderName} deleted "${data.groupName}" group`); 
            displayNotification(notification);
        }
        store.dispatch({
            type: GROUP_DELETED,
            payload: {
                _id: data.groupId
            }
        })
    }catch(err){
        console.log("An error occured in Notification.helpers.js at groupDeleted: ", err);
    }
}

const newImageReceived = async (data) => {
    try{
        const notification = showNewImageNotification(data);
        const storagePath = getAppStoragePath(data.group);
        let key = data.imageKey;
        key = key.replace(`${S3_OBJECT_PATH}/`, "sh_");
        const fullFilePath = `${storagePath}/${key}`;
        notification.setData({
            "image": fullFilePath
        })
        downloadImage(key, data.imageUri, fullFilePath, (progress) => updateProgressToNotification(notification, progress));
    }catch(err){
        console.log("An error occured in Notification.helpers.js at newImageReceived: ", err);
    }
}

const showNewImageNotification = (data, props = {}) => {
    try{
        const senderName = getSenderName(data);
        const newImageNotification  = createNotification('NEW_IMAGE_RECEIVED', `${senderName} shared new image in ${data.group} group`, 'Downloading');
        displayNotification(newImageNotification)
        return newImageNotification;
    }catch(err){
        console.log("Error: Error in showNewImageNotification", err)
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

export const showUploadImageNotification = (activeTrip) => {
    try{
        const activeMembers = activeTrip.members.length - 1; //one less for self
        const newImageNotification = createNotification('NEW_IMAGE_UPLOAD', `Sharing image with ${activeMembers} peoples.`, 'Uploading');
        displayNotification(newImageNotification)
        return newImageNotification;
    }catch(err){
        console.log("Error: Error at showUploadImageNotification", err);
    }
}

export const removeNotification = notification_id => {
    try{
        firebase.notifications().removeDeliveredNotification(notification_id);
    }catch(err){
        console.log("Error: Error at removeNotification", err);
    }
}

export const onInitialNotificationOpen = notification => {
    console.log("notification", notification);
}