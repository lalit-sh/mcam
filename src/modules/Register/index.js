import React, { Component } from 'react';
import { signup, clearError } from "../../redux/actions/identity.action";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Toast from 'react-native-easy-toast'
import {
  ActivityIndicator,
  Keyboard,
  Alert
} from 'react-native'
import Logo from "../../shared/Logo";
import style from "../Login/style";
import { getUniqueId } from 'react-native-device-info';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      password: "",
    };
  }

  componentDidUpdate(prevProp, prevState, snapshot){
    if(this.props.identity.error){
      this.refs.toast.show(this.props.identity.error);
    }

    if(this.props.identity.isLoggedIn){
      this.props.navigation.navigate("AuthMiddleware");
    }
  }
  

  handleUser = ({nativeEvent}) => {

    let username = nativeEvent.text;

    if(this.props.identity.error){
      this.props.clearError();
    }

    if(username == "+91" && this.state.username == ""){
      return;
    }

    username = username.replace("+91-", "")


    this.setState({
      username: username
    });
  }

  handlePassword = password => {
    if(this.props.identity.error){
      this.props.clearError();
    }
    this.setState({
      password: password
    });
  }

  handleSignUp = () => {
    Keyboard.dismiss();
    if(this.props.loading)
      return;
    let { username, password, name } = this.state;
    username = username.trim();
    password = password.trim();
    name = name.trim();
    let error;
    
    if(username == ""){
      error = "Username can't be blank";
    }else if(password == ""){
      error = "Password can't be blank";
    }else if(password.length < 8){
      error = "Password can't be smaller then 8 characters"
    }else if(name == ""){
      error = "Name can't be blank"
    }

    if(error)
      return this.refs.toast.show(error);
      // this.props.login(username, password);
      this.props.signup({
        username: username,
        password: password,
        name: name,
        deviceId: getUniqueId()
      });
  }

  handleSignIn = () => {
    if(!this.props.loading)
    this.props.navigation.navigate("Login")
  }

  forgotPassword = () => {
    return;
  }

  handleName = name => {
    this.setState({
      name: name
    });
  }

  render() {
    return (
          <Container>
            <Content contentContainerStyle={style.container} style={{padding: 15}}>
              <Logo />
              <Form style={style.form}>
                <Item floatingLabel last style={{paddingBottom: 5}}>
                  <Label>Full Name</Label>
                  <Input onChangeText={this.handleName}/>
                </Item>
                <Item floatingLabel last style={{paddingBottom: 5}}>
                  <Label>Mobile Number</Label>
                  <Input keyboardType="numeric" onChange={this.handleUser} value={this.state.username}/>
                </Item>
                <Item floatingLabel last style={{paddingBottom: 5}}>
                  <Label>Password</Label>
                  <Input onChangeText={this.handlePassword} secureTextEntry={true}/>
                </Item>
              </Form>
              <Button onPress={this.handleSignUp} style={style.loginButton}>
                {this.props.loading ? 
                  <ActivityIndicator size="large" color="#0000ff" /> :
                    <Text> Sign up </Text>
                }
              </Button>
              <Button onPress={this.handleSignIn} style={style.registerButton}>
                  <Text> Sign In </Text>
              </Button>
            </Content>
            <Toast ref="toast"/>
          </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ signup: signup, clearError: clearError }, dispatch);
}

//mapping reducer states to component
const mapStateToProps = (state) => ({
  identity: state.identity,
  loading: state.identity ? state.identity.loading : false
})


export default connect(mapStateToProps, mapDispathToProps)(Register);

