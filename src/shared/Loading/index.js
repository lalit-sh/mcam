import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AppStyle } from "../../App.style";
export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={[AppStyle.container, AppStyle.flexCenter]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }
}
