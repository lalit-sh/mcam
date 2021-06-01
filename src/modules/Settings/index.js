import {
  Body,
  Container,
  Content,
  Icon,
  Left,
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
import { AppStyle } from '../../App.style';
class SettingModule extends Component {
  handleLogout = () => {
      this.props.logout();
      return this.props.navigation.navigate("AuthMiddleware");
  };

  showSetting = () => {
    let { navigation } = this.props;
    return navigation.navigate('CameraSetting');
  };

  handleActions = (label) => {
    switch(label.label){
      case "Camera Setting":
        return this.showSetting();
      default:
        break;
    }
  }

  render() {
    let list = [
      {
        label: "Camera Setting",
        icon: "cog"
      },
      {
        label: "Account Setting",
        icon: "user-cog",
      },
      {
        label: "Privacy Setting",
        icon: "user-shield"
      }
    ]
    return (
      <Container style={AppStyle.container}>
        <Header {...this.props} title="Settings" isBack={true} />
        <Content style={{top: 30}}>
          <List>
            {list.map((el, i) => 
              <ListItem thumbnail  onPress={() => this.handleActions(el)} key={i} style={{borderBottomWidth: 0, marginBottom: 8}}>
                <Left>
                    <Icon
                      type={"FontAwesome5"}
                      name={el.icon || "cog"}
                      style={[{fontSize: 24, width: 32}, AppStyle.text]}
                    />
                </Left>
                <Body style={{borderBottomWidth: 0}}>
                  <Text style={[AppStyle.text, {fontSize: 18, fontWeight: 'bold'}]}>{el.label}</Text>
                </Body>
              </ListItem>
            )}
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
