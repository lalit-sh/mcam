import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const style = StyleSheet.create({
    logo: {
        width: 120,
        height: 120,
        borderRadius: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffc300"
    },
    text: {
        fontSize: 48,
        color: "#fff"
    }
})

export default class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={style.logo}>
        <Text style={style.text}> M </Text>
      </View>
    );
  }
}
