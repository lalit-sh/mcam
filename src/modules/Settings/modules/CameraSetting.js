import {
  Body,
  Container,
  Content,
  Left,
  ListItem,
  Right,
  Switch,
  Text,
  Picker
} from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSettings } from '../../../redux/actions/setting.action';
import Header from '../../../shared/Header';
// import RNPickerSelect from 'react-native-picker-select';
import { AppStyle } from '../../../App.style';
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
    this.props.updateSettings(key, value)
  }

  onValueChange = (value) => {
    console.log("Value", value);
  }

  render() {
    return (
      <Container style={{}}>
        <Header {...this.props} title="Camera Setting" isBack={true} />
        <Content style={{top: 30}}>
          <ListItem style={{borderBottomWidth: 0}}>
            <Body>
              <Text style={[AppStyle.text]}>Grid</Text>
            </Body>
            <Right>
              <Switch
                value={this.props.settings.grid}  
                onValueChange ={(v)=> this.updateSettings('grid',!this.props.grid)} />
            </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
              <Body>
                <Text style={{}}>Image Resolution</Text>
              </Body>
              <Right>
                {/* <Picker
                  selectedValue={this.state.imageResolution}
                  onValueChange={(itemValue, itemIndex) =>
                    this.updateImageRes(itemValue)
                  }
                  style={{width: 150}}
                >
                  <Picker.Item label="High" value="high" />
                  <Picker.Item label="Med" value="med" />
                  <Picker.Item label="Low" value="low" />
                </Picker> */}
                <Picker
                  note
                  mode="dropdown"
                  style={{ width: 120 }}
                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange.bind(this)}
                >
                  <Picker.Item label="Wallet" value="key0" />
                  <Picker.Item label="ATM Card" value="key1" />
                  <Picker.Item label="Debit Card" value="key2" />
                  <Picker.Item label="Credit Card" value="key3" />
                  <Picker.Item label="Net Banking" value="key4" />
                </Picker>
              </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
            <Body>
              <Text style={[AppStyle.text]}>Preview Time</Text>
            </Body>
            <Right>
              {/* <RNPickerSelect
                    onValueChange={this.updatePreviewTime}
                    value={this.state.previewTime}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{}}
                    style={{width: 100}}
                    items={[
                        { label: 'Off', value: 'off' },
                        { label: '3s', value: '3' },
                        { label: '5s', value: '5' },
                    ]}
                /> */}
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
