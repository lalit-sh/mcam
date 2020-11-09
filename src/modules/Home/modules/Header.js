import React, { Component } from 'react';
import { cameraStyle as styles } from "../style";
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { Icon } from "native-base";
import { DrawerActions } from 'react-navigation-drawer';
import { RNCamera } from 'react-native-camera';
const flashIcons = {
  on: "flash",
  auto: "flash"
}
class CameraHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // addTrip = () => {
  //   this.props.navigation.navigate("Trips");
  // }
  showSidebar=()=> {
    let { navigation } = this.props;
    return navigation.dispatch(DrawerActions.toggleDrawer());
  }
  handleTrips = () => {
    this.props.navigation.navigate("Trips");
  }
  render() {
    let flashIcon, ratio = this.props.ratio
    if (this.props.flash == "on") flashIcon = "flash"
    else if (this.props.flash == "auto") flashIcon = "flash-auto"
    else if (this.props.flash == false) flashIcon = "flash-off"
    console.log("abc", this.props.flash, flashIcon, ratio)
    return (
      <View style={styles.header}>
          <Icon type="AntDesign" name={"addusergroup"} style={{color: "#fff", width:25}} onPress={this.handleTrips}/>
          <Icon type="MaterialCommunityIcons" name={flashIcon} style={{color: "#fff", width:25}} onPress={this.props.onFlash}/>
          <View style={{width:32}}>
            <View style={{ width:28, borderRadius:5, textAlign: 'center'}}></View>
            <Text style={{color: "#fff",  borderColor:"#fff", borderWidth: 1, paddingLeft:6, fontWeight: 'bold', borderRadius:10, width:40}} onPress={this.props.aspectRatio}>{ratio} </Text>
         </View>
          <Icon type="Entypo" name={"cog"} style={{color: "#fff", width:25}} onPress={this.showSidebar}/>
      </View>
    );
  }
}


export default CameraHeader;