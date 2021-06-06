import {
  Body,
  Container,
  Content,
  Left,
  ListItem,
  Right,
  Text
} from 'native-base';
import React, { Component } from 'react';
import { View, Switch } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSettings } from '../../../redux/actions/setting.action';
import Header from '../../../shared/Header';
// import RNPickerSelect from 'react-native-picker-select';
import { AppStyle, highlightColor, highlightOnColor } from '../../../App.style';
import Picker from "../../../shared/Picker";
// import {Picker} from '@react-native-picker/picker';
class CameraSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageResolution: props.settings.imageResolution,
      previewTime: props.settings.previewTime
    };
  }

  updateImageRes = (e) => {
    this.setState({
      imageResolution: e
    }, this.updateSettings("imageResolution", e));
  }

  updatePreviewTime = (e) => {
    this.setState({
      previewTime: e
    }, this.updateSettings("previewTime", e));
  }

  updateSettings = (key, value) => {
    console.log("here", key, value);
    this.props.updateSettings(key, value)
  }

  render() {
    const { captureSound, grid, imageQuality, previewTime } = this.props.settings;
    return (
      <Container style={AppStyle.container}>
        <Header {...this.props} title="Camera Setting" isBack={true} />
        <Content style={{top: 30}}>
          <ListItem style={{borderBottomWidth: 0}}>
            <Body>
              <Text style={[AppStyle.text]}>Capture Sound</Text>
            </Body>
            <Right>
              <Switch
                value={captureSound}
                onValueChange ={(v)=> this.updateSettings('captureSound', v)} 
                trackColor={{false: highlightColor, true: highlightOnColor}}
              />
            </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
            <Body>
              <Text style={[AppStyle.text]}>Grid</Text>
            </Body>
            <Right>
              <Switch
                value={grid}  
                onValueChange ={(v)=> this.updateSettings('grid', v)} 
                trackColor={{false: highlightColor, true: highlightOnColor}}
              />
            </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
              <Body>
                <Text style={AppStyle.text}>Image Resolution</Text>
              </Body>
              <Right>
                <Picker
                  items={[
                    { label: "High", value: 0.98 },
                    { label: "Medium", value: 0.5 },
                    { label: "Low", value: 0.2 }
                  ]}
                  onChange={(e) => this.updateSettings("imageQuality", e.value)}
                  value={imageQuality}
                  style={{
                    text: AppStyle.text,
                    body: AppStyle.highlighted
                  }}
                />
              </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
            <Body>
              <Text style={[AppStyle.text]}>Preview Time</Text>
            </Body>
            <Right>
            <Picker
                  items={[
                    { label: "Off", value: 0 },
                    { label: "3s", value: 3 },
                    { label: "5s", value: 5 }
                  ]}
                  onChange={(e) => this.updateSettings("previewTime", e.value)}
                  value={previewTime}
                  style={{
                    text: AppStyle.text,
                    body: AppStyle.highlighted
                  }}
                />
            </Right>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ updateSettings }, dispatch);
}

const mapStateToProps = (state) => ({
  identity: state.identity,
  activeTrip: state.trips.activeTrip || null,
  settings: state.settings
});

export default connect(mapStateToProps, mapDispathToProps)(CameraSetting);
