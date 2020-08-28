import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from "native-base";
import RNExitApp from 'react-native-exit-app';

import Header from "../../shared/Header/index";
import Camera from "./modules/camera";
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

import { 
    getFileName,
    getAppStoragePath,
    upsertDirectory,
    moveFile
} from "../../utils/helpers/localStorageHelpers";
import { 
    uploadImage
} from "../../utils/middleware/image";
import { 
    newImageEvent
} from "../../utils/middleware/socket";

class Home extends Component {
  constructor(props) {
    super(props);
    this.activeTrip = this.getActiveTrip();
  }

  getActiveTrip = async () => {
    try{
        this.activeTrip = await AsyncStorage.getItem('ACTIVE_TRIP');
        console.log("this", this.activeTrip);
        if(this.activeTrip && typeof this.activeTrip == 'string'){
            this.activeTrip = JSON.parse(this.activeTrip);
            return this.activeTrip;
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
    Alert.alert(null,`Seems like you have don't have any active trip. Please select an active trip to click and share image.`, [
        {
            text: 'Trips',
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

  handleClick = (uri) => {
    if(!this.activeTrip){
        return this.noActiveTripDialog();
    }
    console.log("image captured");
    const filename = getFileName();
    const storagePath = getAppStoragePath(this.activeTrip.name);
    
    const fullFilePath = `${storagePath}/${filename}`;
    upsertDirectory(storagePath);
    moveFile(uri, fullFilePath);
    uploadImage(fullFilePath, this.getFileNameForS3Upload(filename), (evt) => {
        let uploaded = parseInt((evt.loaded * 100) / evt.total);
        console.log("Uploaded :: " + uploaded +'%');
    }, (err, data) => {
        if(err){
            this._toast.current.show(`Unable to upload ${filename}`);
            console.log(`Unable to upload ${filename}`, error);
        }
        console.log(`uploaded successfully ${filename}`, data);
        newImageEvent(filename, data.Location, this.activeTrip);
    });

  }

  render() {
    return (
      <Container>
          <Camera 
            onClick={this.handleClick}
            navigation={this.props.navigation}
          />
      </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}

const mapStateToProps = (state) => ({
    identity: state.identity,
    activeTrip: state.trips.activeTrip || null
});

export default connect(mapStateToProps, mapDispathToProps)(Home);
