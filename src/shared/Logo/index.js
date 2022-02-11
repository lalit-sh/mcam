import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const style = StyleSheet.create({
    logo: {
        width: 120,
        height: 120,
        borderRadius: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffc300"
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
        <Image 
          style={{...style.logo, ...this.props.style}}  
          source={require("../../assets/images/logo.png")}
        />
    );
  }
}
