import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, View } from 'native-base';
import {
  ActivityIndicator,
  Keyboard,
  Settings
} from 'react-native'

class SettingModule extends Component {

  render() {
    return (
          <Container>
              <View>
                  <Text>
                      This is Settings.
                  </Text>
              </View>
          </Container>
    );
  }
}


export default SettingModule;

