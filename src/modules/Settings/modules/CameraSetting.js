import {
  Body,
  Container,
  Content,

  Left,
  ListItem,
  Picker, Right,
  Switch,
  Text
} from 'native-base';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleGrid } from '../../../redux/actions/setting.action';
import Header from '../../../shared/Header';
class CameraSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'high',
      chosen: '3',
      switchValue: false
    };
  }
  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }

  render() {
    return (
      <Container>
        <Header {...this.props} title="Camera Setting" isBack={true} />
        <Content style={{top: 30}}>
          <ListItem style={{borderBottomWidth: 0}}>
            <Left>
              <Text>Grid</Text>
            </Left>
            <Body />
            <Right>
              <Switch
                value={this.props.settings.grid}  
                onValueChange ={(switchValue)=>this.props.toggleGrid()} />
            </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
            <Left>
              <Text>Show Preview</Text>
            </Left>
            <Body />
            <Right>
              <Switch/>
            </Right>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
              <Text>Image Resolution</Text>
              <Picker
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Low" value="low" />
              </Picker>
          </ListItem>
          <ListItem style={{borderBottomWidth: 0}}>
              <Text>Preview Time</Text>
              <Picker
                selectedValue={this.state.chosen}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="3" value="3" />
                <Picker.Item label="5" value="5" />
                <Picker.Item label="10" value="10" />
              </Picker>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ toggleGrid }, dispatch);
}

const mapStateToProps = (state) => ({
  identity: state.identity,
  activeTrip: state.trips.activeTrip || null,
  settings: state.settings
});

export default connect(mapStateToProps, mapDispathToProps)(CameraSetting);
