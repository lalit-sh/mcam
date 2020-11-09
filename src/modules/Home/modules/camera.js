import React, { PureComponent } from 'react';
import { View} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { cameraStyle as styles } from "../style";
import Footer from "./Footer";
import Header from "./Header";
import ImagePicker from 'react-native-image-picker';
import { Dimensions } from 'react-native'

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
            frontCam: false,
            flash: false,
            ratio: "4:3"
        }
    }

    async componentDidUpdate(props,state) {
        // if (this._camera ) {
        //     console.log("this", this._camera)
        // this.ratios = await this._camera.getSupportedRatiosAsync();
        // console.log("ratios", this.ratios)
        // }
    }

    getCameraType = () => {
        if(this.state.frontCam){
            return RNCamera.Constants.Type.front;
        }
        return RNCamera.Constants.Type.back;
    }

    getFlash = () => {
        //possible values for flash: auto, on off, tourch
        if(this.state.flash){
            return RNCamera.Constants.FlashMode[this.state.flash];
        }

        return RNCamera.Constants.FlashMode.off;
    }

    // getSupportedRatiosAsync = async (promise) => {
    //     console.log(promise);
    // }

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

    handleFlash = () => {
        let flash = this.state.flash
        console.log(flash)
        if ( !flash ) flash = "on"
        else if ( flash == "on") flash = "auto"
        else if (flash == "auto") flash = false
        this.setState( {
            flash: flash
        })
    }
    prepareRatio = async () => {
        if (Platform.OS === 'android' && this._camera) {
            let ratio = this.state.ratio
            this.ratios = await this._camera.getSupportedRatiosAsync();
            if (this.ratios) {
                let index = this.ratios.indexOf(ratio)
                if(this.ratios[index+1]) 
                ratio = this.ratios[index+1]
                
                else
                    ratio = this.ratios[0]
                this.setState({ ratio: ratio });
                console.log("setState", ratio)
            }
             
             
        }
    }
    getPreviewHeight = () => {
        let {width, height} = Dimensions.get('window');
        let hght = height;
        let ratio = this.state.ratio;
            ratio = ratio.split(":")
        let h = ratio[0]
        let w = ratio[1]
        hght = (h*width/w);
        if(height - hght < 200) return height;
        console.log(hght);
        if(hght < 100) return 100;
        return hght;
    }

    render() {
        let height = this.getPreviewHeight();
        return (
            <View style={styles.container}>
                <Header {...this.props} onFlash = {this.handleFlash} flash = {this.state.flash} aspectRatio = {this.prepareRatio} ratio = {this.state.ratio}/>
                <RNCamera
                     ratio={this.state.ratio}
                    ref={(ref) => {
                        this._camera = ref;
                    }}
                    style={{
                        height: height
                      }}
                    type={this.getCameraType()}
                    flashMode={this.getFlash()}
                    androidCameraPermissionOptions={cameraPermissionConfig}
                    androidRecordAudioPermissionOptions={audioRecordingPermissionConfig}
                />
                <Footer takePicture={this.takePicture} onChangeCamera={this.changeCamera} onGallery={this.onGallery}/>
            </View>
        );
    }
}

export default Camera;