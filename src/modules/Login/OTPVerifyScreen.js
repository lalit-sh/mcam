import React, { Component, createRef } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, Keyboard } from "react-native";
import { authenticate, clearError } from "../../redux/actions/identity.action";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Container, Button, Icon } from 'native-base';
import Toast from 'react-native-easy-toast'
import Logo from "../../shared/Logo";
import style from "./style";
import { AppStyle } from "../../App.style";
import KeyboardDismissableView from '../../components/KeyboardDismissableView';
import Text from '../../components/Text';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { authInit } from '../../redux/services/identity.service';

class OTPVerifyScreen extends Component {
    state = {
        username: "",
        showToast: false,
        timeout: 60
    }

    _toast = createRef()


    handleSubmit = () => {
        this.errorDisplayed = false;
        if(this.state.otp.length < 4){
            this._toast.current.show("Incomplete OTP");
            return false;
        }
        this.props.authenticate(this.state.username, this.state.otp);
    }

    componentDidMount() {
        this.setState({ username: this.props.navigation.state.params.username });        
        this.startTimer();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.timeout == 60 && !this.t){
            this.startTimer();
        }

        if(this.props.identity.error && !this.errorDisplayed){
            this.errorDisplayed = true;
            this.setState({ otp: "", timeout: 0 });
            this._toast.current.show(this.props.identity.error);
            this.props.clearError();
        }
        if(this.props.identity.isLoggedIn){
            this.props.navigation.navigate("AuthMiddleware");
        }
    }

    startTimer = () => {
        this.t = setInterval(() => {
            if(this.state.timeout == 0){
                return clearInterval(this.t);
            }
            this.setState({ 
                timeout: this.state.timeout - 1
            });
        }, 1000);
    }
    

    resendOtp = async () => {
        try{
            if(this.state.loading)
                return false;
            this.setState({ 
                loading: true
            });
            
            await authInit(this.state.username);
            if(this.t){
                clearInterval(this.t);
                this.t = null;
            }
            this.setState({  
                timeout: 60,
                loading: false
            });
            this._toast?.current?.show("OTP resent successfully.")
        }catch(err){
            this.setState({ 
                loading: false
            });
            this._toast?.current?.show("Unable to send OTP. Please check the number and try again.")
        }
    }

    render() {
        return (
            <KeyboardDismissableView>
                <Container style={{...AppStyle.container, ...style.container}}>
                    <Icon 
                        type="MaterialIcons" 
                        name={"arrow-back"} 
                        style={{...AppStyle.text, ...style.backArrow}}
                        onPress={() => this.props.navigation.goBack()}
                    />
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
                                Please enter the 4 digit OTP received on your number.
                            </Text> 
                        </View>
                        <View style={{...style.inputContainer, marginBottom: 15}}>
                            <SmoothPinCodeInput
                                cellSize={36}
                                // autoFocus={true}
                                codeLength={4}
                                onFulfill={() => Keyboard.dismiss()}
                                value={this.state.otp}
                                onTextChange={otp => this.setState({ otp })}
                                cellStyle={{
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: '#fff',
                                    backgroundColor: '#444',
                                }}
                                cellStyleFocused={{
                                    borderColor: '#fff',
                                    borderWidth: 2,
                                }}
                                textStyle={{
                                    fontSize: 24,
                                    color: 'salmon',
                                    fontFamily: "Cabin"
                                }}
                            />
                        </View>
                        <View style={{...style.inputContainer}}>
                            {this.state.timeout == 0 && 
                                <TouchableOpacity onPress={this.resendOtp}>
                                    <Text style={{...AppStyle.text, ...AppStyle.center }}>
                                        Resend code
                                    </Text>
                                </TouchableOpacity>
                            }
                            {this.state.timeout > 0 && 
                                <Text style={{...AppStyle.text, ...AppStyle.center, marginLeft: 3}}>
                                    Resend code in 00:{this.state.timeout.toLocaleString('en-US', {
                                            minimumIntegerDigits: 2,
                                            useGrouping: false
                                    })}
                                </Text>
                            }
                        </View>
                        <TouchableOpacity activeOpacity={0.6} style={{...AppStyle.warningBtn, ...AppStyle.btn, ...style.submit}} onPress={this.handleSubmit}>
                            {this.props.loading &&
                                <ActivityIndicator color={"#fff"} animating={true}/>
                            }
                            {!this.props.loading && 
                                <Text style={{...AppStyle.text, ...AppStyle.textCenter}}>
                                    Submit
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
    return bindActionCreators({  clearError: clearError, authenticate }, dispatch);
}

//mapping reducer states to component
const mapStateToProps = (state) => ({
    identity: state.identity,
    loading: state.identity ? state.identity.loading : false
})


export default connect(mapStateToProps, mapDispathToProps)(OTPVerifyScreen);

