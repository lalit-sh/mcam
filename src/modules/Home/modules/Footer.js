import React, { Component } from 'react';
import { cameraStyle as styles } from "../style";
import { TouchableOpacity, View, Image } from 'react-native';
import galleryImg from "../../../assets/images/gallery.png";
import { Icon } from "native-base";
class CameraFooter extends Component {
  constructor(props) {
    super(props);
  }

  // addTrip = () => {
  //   this.props.navigation.navigate("Trips");
  // }

  render() {
    const { takePicture, onChangeCamera, onGallery, lastImageTaken } = this.props;
    let gi = lastImageTaken ? `file:${lastImageTaken}` : null;
    return (
      <View style={styles.footer}>
          <TouchableOpacity onPress={onChangeCamera}>
            <Icon type="EvilIcons" name={"refresh"} style={{color: "#fff", fontSize: 46}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.capture}>
            <View style={styles.captureInnerCircle} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onGallery} style={styles.gallery}>
            {gi &&
              <Image source={{width: 50, height: 50, uri: gi}} style={{borderRadius: 50}}/>
            }
            {!gi &&
              <Image source={galleryImg} style={{borderRadius: 50, width: 50, height: 50}}/>
            }
          </TouchableOpacity>
      </View>
    );
  }
}


export default CameraFooter;