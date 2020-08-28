import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { cameraStyle as styles } from "../style";
import Footer from "./Footer";
import ImagePicker from 'react-native-image-picker';

const cameraPermissionConfig = {
    title: 'Permission to use camera',
    message: 'We need your permission to use your camera',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel'
};

const audioRecordingPermissionConfig = {
    title: 'Permission to use audio recording',
    message: 'We need your permission to use your audio',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
};

class Camera extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            frontCam: false
        }
    }

    getCameraType = () => {
        if(this.state.frontCam){
            return RNCamera.Constants.Type.front;
        }
        return RNCamera.Constants.Type.back;
    }

    getFlass = () => {
        //possible values for flash: auto, on off, tourch
        if(this.props.flash){
            return RNCamera.Constants.FlashMode[this.props.flash];
        }

        return RNCamera.Constants.FlashMode.off;
    }

    getSupportedRatiosAsync = async (promise) => {
        console.log(promise);
    }

    takePicture = async () => {
        try{
            if(this._camera){
                const options = {
                    quality: this.props.quality || 0.5,
                    base64: false
                }
                const data = await this._camera.takePictureAsync(options);
                if(this.props.onClick){
                    this.props.onClick(data.uri);
                }else{
                    console.log("Picture is taken and stored at temp folder at ", data.uri);
                }
            }
        }catch(error){
            console.log("Error Occured while capturing the image", error);
        }
    }

    onGallery = () => {
        console.log("oka")
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };
        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
          });
    }

    changeCamera = () => {
        this.setState({
            frontCam: !this.state.frontCam
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={(ref) => {
                        this._camera = ref;
                    }}
                    style={styles.preview}
                    type={this.getCameraType()}
                    flashMode={this.getFlass()}
                    androidCameraPermissionOptions={cameraPermissionConfig}
                    androidRecordAudioPermissionOptions={audioRecordingPermissionConfig}
                />
                <Footer takePicture={this.takePicture} onChangeCamera={this.changeCamera} onGallery={this.onGallery}/>
            </View>
        );
    }
}

export default Camera;