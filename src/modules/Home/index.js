import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from "native-base";
import RNExitApp from 'react-native-exit-app';
import Camera from "./modules/camera";
import { Alert, StatusBar } from 'react-native';
import PushNotification from "../../utils/PushNotification";
import { updateFcmToken } from "../../redux/actions/users.action";
import { shareImageWithGroup } from "../../redux/actions/trips.action";
import { 
    getFileName,
    getAppStoragePath,
    upsertDirectory,
    moveFile,
    getStoragePermission
} from "../../utils/helpers/localStorageHelpers";
import { 
    uploadImage,
} from "../../utils/middleware/image";
import { handleNewDataMessage, updateProgressToNotification, showUploadImageNotification, removeNotification } from "../../utils/helpers/Notification.helpers";
import Toast from 'react-native-easy-toast';

class Home extends Component {
    constructor(props) {
        super(props);
        this.PushNotification = new PushNotification({
            onNewFcmToken: this.handleNewFcmToken,
            onDataMessage: handleNewDataMessage
        });
        this._toast = createRef()
    }

    componentDidMount = async () => {
        this.PushNotification.init();
        getStoragePermission()
        this.activeTrip = await this.getActiveTrip();
    }

    handleNewFcmToken = (fcmToken) => {
        this.props.updateFcmToken(fcmToken);
    }

    getActiveTrip = async () => {
        try{
            let activeTrip = this.props.activeTrip;
            if(activeTrip){
                if(typeof activeTrip == 'string')
                    activeTrip = JSON.parse(activeTrip);
                return activeTrip;
            }
            return null;
        }catch(error){
            console.log("Error getting active trip", error);
            return null;
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.activeTrip && (!this.activeTrip || !this.activeTrip.name || this.activeTrip.name != this.props.activeTrip)){
            this.activeTrip = this.props.activeTrip;
        }
    };


    noActiveTripDialog(){
        Alert.alert(null,`Seems like you have don't have any active group. Please select an active group to click and share image.`, [
            {
                text: 'Groups',
                onPress: () => {
                    this.props.navigation.navigate("Trips");
                }
            },
            {
                text: "Exit",
                onPress: () => {
                    RNExitApp.exitApp(); 
                }
            }
        ]);
    }

    getFileNameForS3Upload(localFN){
        let { username } = this.props.identity;
        return `${username}_${this.activeTrip.name}_${localFN}`;
    }

    getFilePath = () => {
        const filename = getFileName();
        const storagePath = getAppStoragePath(this.activeTrip.name);
        const fullFilePath = `${storagePath}/${filename}`;
        return fullFilePath;
    }

    handleClick = async (uri) => {
        if(!this.activeTrip){
            return this.noActiveTripDialog();
        }
        let { username } = this.props.identity;
        const fullFilePath = this.getFilePath()
        const storagePath = getAppStoragePath(this.props.activeTrip.name)
        const filename = getFileName();
        upsertDirectory(storagePath);
        await moveFile(uri, fullFilePath);
        if(this.activeTrip.members.length > 1){
            //no need to upload file to serever if main participent is self
            let notification;
            uploadImage(fullFilePath, this.getFileNameForS3Upload(filename), (evt) => {
                let uploaded = parseInt((evt.loaded * 100) / evt.total);
                if(!notification){
                    notification = showUploadImageNotification(this.props.activeTrip)
                }
                if(notification)
                    updateProgressToNotification(notification, uploaded, 'Done');
            }, (err, data) => {
                if(notification)
                    removeNotification(notification.notificationId)
                if(err){
                    console.log("Error while uploading file", err);
                    this._toast && this._toast.current.show(`Unable to upload image`);
                }else{
                    let d = {
                        "imageUrl": data.Location,
                        "members": this.activeTrip.members.filter(el => el.username !== username), //skipping self
                        "groupId": this.activeTrip._id,
                        "imageKey": data.key
                    }
                    this.props.shareImageWithGroup(d)
                }
            });
        }
    }

    render() {
        return (
            <Container>
                <StatusBar backgroundColor={"#000"} hidden/>
                <Camera 
                    onClick={this.handleClick}
                    navigation={this.props.navigation}
                    activeTrip={this.activeTrip}
                />
                <Toast ref={this._toast}/>
            </Container>
        );
    }
}

function mapDispathToProps(dispatch) {
    return bindActionCreators({ updateFcmToken, shareImageWithGroup }, dispatch);
}

const mapStateToProps = (state) => ({
    identity: state.identity,
    activeTrip: state.trips.activeTrip || null,
    contactNames: state.users.contactName
});

export default connect(mapStateToProps, mapDispathToProps)(Home);
