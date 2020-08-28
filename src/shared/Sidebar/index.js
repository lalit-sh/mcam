import React, { Component } from "react";
import { Image } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";

import { logout } from "../../redux/actions/identity.action";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { routes } from "../../utils/SidebarLinks";



class SideBar extends Component {
  
  handleSidebarNav = (data) => {
    if(data == "Logout"){
      this.props.logout();
      return this.props.navigation.navigate("AuthMiddleware");
    }

    return this.props.navigation.navigate(data);
  }

  render() {
    return (
      <Container>
        <Content>
          <Image
            source={{
              uri: "https://github.com/GeekyAnts/NativeBase-KitchenSink/raw/react-navigation/img/drawer-cover.png"
            }}
            style={{
              height: 120,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center"
            }}/>
            <Image
              square
              style={{ height: 80, width: 70 }}
              source={{
                uri: "https://github.com/GeekyAnts/NativeBase-KitchenSink/raw/react-navigation/img/logo.png"
              }}
            />
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={this.handleSidebarNav.bind(this, data)}>
                  <Text>{data}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}


function mapDispathToProps(dispatch) {
  return bindActionCreators({ logout: logout }, dispatch);
}

//mapping reducer states to component
const mapStateToProps = (state) => ({})


export default connect(mapStateToProps, mapDispathToProps)(SideBar);
