import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import AsyncStorage from "@react-native-community/async-storage";

const channelConfig = {
    id: "default_fcm_channel",
    name: "Notification",
    desc: "Default Notification Channel"
}


class PushNotification {
    constructor(callbacks = null){
        if(callbacks){
            if(callbacks.onNotification)
                this.onNotification = callbacks.onNotification;

            if(callbacks.getInitialNotification)
                this.onInitialNotificationOpen = callbacks.getInitialNotification;
            
            if(callbacks.onDataMessage)
                this.onDataMessage = callbacks.onDataMessage;
            
            if(callbacks.onNotificationOpened)
                this.onNotificationOpened = callbacks.onNotificationOpened;
            
            if(callbacks.onNotificationDisplayed)
                this.onNotificationDisplayed = callbacks.onNotificationDisplayed;
            
            if(callbacks.onNewFcmToken)
                this.onNewFcmToken = callbacks.onNewFcmToken;
        }
    }

    static getChannel = () => {
        return channelConfig;
    }

    async createChannel(){
        const channel = new firebase.notifications.Android.Channel(channelConfig.id, channelConfig.name, firebase.notifications.Android.Importance.Max)
                .setDescription(channelConfig.desc);
                firebase.notifications().android.createChannel(channel);
    }

    async init() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    async getToken() {
        fcmToken = await firebase.messaging().getToken();
        // if (fcmToken) {
        //     // user has a device token
        //     // await AsyncStorage.setItem('fcmToken', fcmToken);
        //     // return fcmToken;
        // }
        if(this.onNewFcmToken)
            this.onNewFcmToken(fcmToken);
        this.createNotificationListeners();
    }

    async createNotificationListeners() {

        if(Platform.OS === "android"){
            this.createChannel();
        }

        //Triggered when a particular notification has been received
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            if(this.onNotification){
                this.onNotification(notification);
            }else{
                if(Platform.OS === "android"){
                    notification
                        .android.setChannelId(channelConfig.id)
                        .android.setSmallIcon('@mipmap/ic_stat_ic_notification');
                }

                firebase.notifications()
                    .displayNotification(notification);
            }
        });


        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            if(this.onNotificationDisplayed){
                this.onNotificationDisplayed(notification);
            }
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notification) => {
            if(this.onNotificationOpened){
                this.onNotificationOpened(notification);
            }else{
                // Get the action triggered by the notification being opened
                const action = notification?.action;
                // Get information about the notification that was opened
                const localNotification = notification?.notification;
                firebase.notifications().removeDeliveredNotification(localNotification.notificationId);
            }
        })
      
        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if(this.onInitialNotificationOpen){
            this.onInitialNotificationOpen(notificationOpen)            
        }else if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;

        }

        
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            if(this.onDataMessage)    
                this.onDataMessage(message);
        });

        this.onTokenRefreshListner = firebase.messaging().onTokenRefresh(async fcmToken => {
            if(this.onNewFcmToken){
                this.onNewFcmToken(fcmToken);
            }else{
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        });
    }

    createNotification(){
        //to create notification manually
        if(Platform.OS === "android"){
            notification
                .android.setChannelId(channelConfig.id)
                .android.setSmallIcon('@mipmap/ic_stat_ic_notification');
        }

        const localNotification = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
        }) 
        firebase.notifications().displayNotification(localNotification)
        .catch(err => console.error(err));
    }

    async setNotificationBadge(count){
        return await firebase.notifications().setBadge(count);
    }
}

export default PushNotification;
