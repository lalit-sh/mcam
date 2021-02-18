import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from "native-base";
import RNExitApp from 'react-native-exit-app';
import Camera from "./modules/camera";
import AsyncStorage from '@react-native-community/async-storage';
import { Alert, StatusBar } from 'react-native';

import { 
    getFileName,
    getAppStoragePath,
    upsertDirectory,
    moveFile,
    getStoragePermission
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
  }

  componentDidMount = async () => {
    getStoragePermission()
    this.activeTrip = await this.getActiveTrip();
  }
  

  getActiveTrip = async () => {
    try{
        let activeTrip = this.props.activeTrip;
        console.log(activeTrip)
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

  handleClick = (uri) => {
    if(!this.activeTrip){
        return this.noActiveTripDialog();
    }
    const filename = getFileName();
    const storagePath = getAppStoragePath(this.activeTrip.name);
    const fullFilePath = `${storagePath}/${filename}`;
    upsertDirectory(storagePath);
    moveFile(uri, fullFilePath);
    // uploadImage(fullFilePath, this.getFileNameForS3Upload(filename), (evt) => {
    //     let uploaded = parseInt((evt.loaded * 100) / evt.total);
    //     console.log("Uploaded :: " + uploaded +'%');
    // }, (err, data) => {
    //     if(err){
    //         this._toast.current.show(`Unable to upload ${filename}`);
    //     }
    //     newImageEvent(filename, data.Location, this.activeTrip);
    // });

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
