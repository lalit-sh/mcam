import React, { PureComponent } from 'react';
import { View} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { cameraStyle as styles } from "../style";
import Footer from "./Footer";
import Header from "./Header";
import ImagePicker from 'react-native-image-picker';
import { Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

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
            ratio: "16:9"
        }
    }

    componentDidMount = async () => {
        try{
            let ratio = await AsyncStorage.getItem("CAMERA_RATIO");
            console.log("ratio", ratio);
            if(ratio) this.setState({ratio: ratio})
        }catch(err){
            console.log(err);
        }
    };
    

    getCameraType = () => {
        if(this.state.frontCam){
            return RNCamera.Constants.Type.front;
        }
        return RNCamera.Constants.Type.back;
    }

    getFlash = () => {
        if(this.state.flash){
            return RNCamera.Constants.FlashMode[this.state.flash];
        }

        return RNCamera.Constants.FlashMode.off;
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
        try{
            if (Platform.OS === 'android' && this._camera) {
                let ratio = this.state.ratio
    
                
                let ratios = await this._camera.getSupportedRatiosAsync();
                if(ratio == "1:1") ratio = "4:3"
                else if(ratio == "4:3"){
                    if(ratios.includes("19:9"))
                        ratio = "19:9";
                    else if(ratios.includes("16:9"))
                        ratio = "16:9";
                    else
                        ration= "1:1"
                } else if(ratio == '19:9' || ratio == '16:9'){
                    ratio = "1:1";
                }
                console.log(ratio)
                await AsyncStorage.setItem("CAMERA_RATIO", ratio)
                this.setState({ ratio: ratio });
            }
        }catch(err){
            console.log("Error in prepareRatio", err)
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
        if(hght < 100) return 100;
        return hght;
    }

    render() {
        let height = this.getPreviewHeight();
        return (
            <View style={styles.container}>
                <Header 
                    {...this.props} 
                    onFlash = {this.handleFlash} 
                    isFlash={!this.state.frontCam}
                    flash = {this.state.flash}
                    onRatioChange = {this.prepareRatio} 
                    ratio = {(this.state.ratio == "16:9" || this.state.ratio == "19:9") ? "FULL_SCREEN" : this.state.ratio}
                />
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