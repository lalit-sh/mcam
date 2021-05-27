import React, { Component } from 'react';
import { cameraStyle as styles, ratioIconStyle } from "../style";
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { Icon } from "native-base";
// import { DrawerActions } from 'react-navigation-drawer';
// import { RNCamera } from 'react-native-camera';
const flashIcons = {
  on: "flash-on",
  auto: "flash-auto",
  off: "flash-off"
}
class CameraHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  showSidebar=()=> {
    let { navigation } = this.props;
    return navigation.navigate("Settings");
  }

  handleTrips = () => {
    this.props.navigation.navigate("Trips");
  }

  render() {
    let { isFlash, flash, ratio, isRatio, onRatioChange } = this.props;
    let flashIcon = flashIcons[flash || "off"];
    return (
      <View style={styles.header}>
          <Icon type="MaterialIcons" name={"group-add"} style={{...styles.headerIconStyle, fontSize: 32}} onPress={this.handleTrips}/>
          {isFlash && 
            <Icon type="MaterialIcons" name={flashIcon} style={styles.headerIconStyle} onPress={this.props.onFlash}/>
          }
          {isRatio &&
            <RatioIcon ratio={ratio} onPress={onRatioChange} />
          }
          <Icon type="MaterialIcons" name={"settings"} style={styles.headerIconStyle} onPress={this.showSidebar}/>
      </View>
    );
  }
}

const RatioIcon = (props) => {
  let { ratio, onPress } = props;
  return  <TouchableOpacity style={ratioIconStyle.container} onPress={onPress}>
            <View style={ratioIconStyle.body} />
            {ratio !== 'FULL_SCREEN' &&
              <Text 
                style={ratioIconStyle.text}>{ratio}</Text>
            }
          </TouchableOpacity>
}

CameraHeader.defaultProps = {
  isFlash: true,
  isRatio: true
}

export default CameraHeader;