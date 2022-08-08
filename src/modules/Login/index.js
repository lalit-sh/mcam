import React, { Component, createRef } from 'react';
import { View, TextInput, KeyboardAvoidingView, TouchableOpacity, Keyboard, ActivityIndicator } from "react-native";
import { clearError } from "../../redux/actions/identity.action";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Container } from 'native-base';
import Toast from 'react-native-easy-toast'
import Logo from "../../shared/Logo";
import style from "./style";
import { AppStyle } from "../../App.style";
import KeyboardDismissableView from '../../components/KeyboardDismissableView';
import Text from '../../components/Text';
import { authInit } from '../../redux/services/identity.service';
import { getUniqueId } from 'react-native-device-info';

class Login extends Component {
    state = {
        username: "",
        showToast: false,
        loading: false
    }

    _toast = createRef()
    
    handleChange = (e) => {
        this.setState({
            username: e
        })
    }

    handleSubmit = async () => {
        try{
            Keyboard.dismiss();
            if(this.state.loading)
                return false;
            let u = this.state.username;
            if(!u){
                this._toast?.current?.show("Phone number can not be blank.");
                return;
            }else if(u < 10){
                this._toast?.current?.show("Phone number must be atleast 10 digit long.");
                return;
            }
            this.setState({
                loading: true
            });
            await authInit(this.state.username, getUniqueId())
            this.setState({
                loading: false
            })
            this.props.navigation.navigate("OTPVerifyScreen", {username: this.state.username});
        }catch(err){
            console.log("Error in login screen", err);
            this.setState({
                loading: false
            })
            this._toast?.current?.show("Unable to send OTP. Please check the number and try again.")
        }
    }

    render() {
        return (
            <KeyboardDismissableView>
                <Container style={{...AppStyle.container, ...style.container}}>
                    <KeyboardAvoidingView behavior="padding">
                        <View style={style.logoContainer}>
                            <Logo style={style.logo}/>
                        </View>
                        <View style={{...AppStyle.marginBtm20}}>
                            <Text style={{
                                    ...AppStyle.text, 
                                    ...AppStyle.textCenter, 
                                    ...AppStyle.marginBtm10,
                                    fontSize: 16
                                }}>
                                Please enter your mobile number,
                                we'll send you a 4 digit code to verify your number.
                            </Text> 
                        </View>
                        <View style={style.inputContainer}>
                            <TextInput 
                                style={{...AppStyle.input, marginRight: 10}} 
                                editable={false} 
                                value="+91"
                            />
                            <Text style={{...AppStyle.text, marginRight: 10}}>
                                -
                            </Text>
                            <TextInput 
                                style={{...AppStyle.input, flex: 1}} 
                                value={this.state.username}
                                onChangeText={this.handleChange}
                                placeholder='Phone Number'
                                keyboardType='numeric'
                                placeholderTextColor={'#bdbdbd'}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.6} style={{...AppStyle.warningBtn, ...AppStyle.btn}} onPress={this.handleSubmit}>
                            {this.state.loading &&
                                <ActivityIndicator color={"#fff"} animating={true}/>
                            }
                            {!this.state.loading && 
                                <Text style={{...AppStyle.text, ...AppStyle.textCenter}}>
                                    Next
                                </Text>
                            }
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    <Toast ref={this._toast} style={{backgroundColor:'#444'}}/>
                </Container>
            </KeyboardDismissableView>
        );
    }
}

function mapDispathToProps(dispatch) {
    return bindActionCreators({ clearError }, dispatch);
}

//mapping reducer states to component
const mapStateToProps = (state) => ({
    identity: state.identity,
    loading: state.identity ? state.identity.loading : false
})


export default connect(mapStateToProps, mapDispathToProps)(Login);

