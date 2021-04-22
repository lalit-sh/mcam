import {
  Body,
  Container,
  Content,
  Icon,
  List,
  ListItem,
  Right,
  Text
} from 'native-base';
import React, { Component } from 'react';
import { logout } from '../../redux/actions/identity.action';
import Header from '../../shared/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { style } from "./style";
class SettingModule extends Component {
  handleLogout = () => {
      this.props.logout();
      return this.props.navigation.navigate("AuthMiddleware");
  };

  showSetting = () => {
    let {navigation} = this.props;
    return navigation.navigate('CameraSetting');
  };

  render() {
    return (
      <Container>
        <Header {...this.props} title="Settings" isBack={true} />
        <Content style={{top: 30}}>
          <List>
            <ListItem onPress={this.showSetting}>
              <Body>
                <Text>Camera Setting</Text>
              </Body>
              <Right>
                <Icon
                  type="AntDesign"
                  name="right"
                  style={({fontSize: 20}, {color: '#000'})}
                />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Account Setting</Text>
              </Body>
              <Right>
                <Icon
                  type="AntDesign"
                  name="right"
                  style={({fontSize: 20}, {color: '#000'})}
                />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Privacy Setting</Text>
              </Body>
              <Right>
                <Icon
                  type="AntDesign"
                  name="right"
                  style={({fontSize: 20}, {color: '#000'})}
                />
              </Right>
            </ListItem>
          </List>
        </Content>
        <List style={({postion: 'relative'}, {bottom: 0})}>
          <ListItem style={{borderBottomWidth: 0}}>
            <Body>
              <Text
                style={style.logout}
                onPress={this.handleLogout}>
                Logout
              </Text>
            </Body>
          </ListItem>
        </List>
      </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ logout: logout }, dispatch);
}

//mapping reducer states to component
const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, mapDispathToProps)(SettingModule);
// export default SettingModule;
