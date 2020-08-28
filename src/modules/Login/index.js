import React, { Component } from 'react';
import { login, clearError } from "../../redux/actions/identity.action";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Container, Content, Form, Item, Input, Label, Button, Text, View } from 'native-base';
import Toast from 'react-native-easy-toast'
import {
  ActivityIndicator,
  Keyboard
} from 'react-native'
import Logo from "../../shared/Logo";
import style from "./style";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showToast: false
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

  handleSignIn = () => {
    Keyboard.dismiss();
    if(this.props.loading)
      return;
    let { username, password } = this.state;
    username = username.trim();
    password = password.trim();
    let error;
    if(username == ""){
      error = "Username can not be blank";
    }else if(password.trim() == ""){
      error = "Password can not be blank";
    }

    if(error)
      return this.refs.toast.show(error);
    
      this.props.login(username, password);
  }

  forgotPassword = () => {
    return;
  }

  handleRegister = () => {
    this.props.navigation.navigate("Register");
  }

  render() {
    return (
          <Container>
            <Content contentContainerStyle={style.container} style={{padding: 15}}>
              <Logo />
              <Form style={style.form}>
                <Item floatingLabel last style={{paddingBottom: 5}}>
                  <Label style={{marginBottom: 5}}>Mobile Number</Label>
                  <Input 
                    keyboardType="numeric" 
                    onChange={this.handleUser} 
                    value={this.state.username}
                  />
                </Item>
                <Item floatingLabel last style={{paddingBottom: 5}}>
                  <Label>Password</Label>
                  <Input onChangeText={this.handlePassword} secureTextEntry={true}/>
                </Item>
              </Form>
              <Button onPress={this.handleSignIn} style={style.loginButton}>
                {this.props.loading ? 
                  <ActivityIndicator size="small" color="#fff" /> :
                    <Text> Sign In </Text>
                }
              </Button>
              <Button onPress={this.handleRegister} style={style.registerButton}>
                    <Text style={style.registerButtonText}> Sign Up </Text>
              </Button>
            </Content>
            <Toast ref="toast"/>
          </Container>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ login: login, clearError: clearError }, dispatch);
}

//mapping reducer states to component
const mapStateToProps = (state) => ({
  identity: state.identity,
  loading: state.identity ? state.identity.loading : false
})


export default connect(mapStateToProps, mapDispathToProps)(Login);

