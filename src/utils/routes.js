import {
    createAppContainer,
    createSwitchNavigator,
} from 'react-navigation';
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Home from "../modules/Home";
import AuthMiddleware from "./middleware/auth";
import LoginScreen from "../modules/Login";
import RegisterScreen from "../modules/Register";
import SideBar from '../shared/Sidebar';
import Trips from "../modules/Trips";
import AddMembers from "../modules/AddMembers";

const headerMode = {
    headerMode: "none",
    navigationOptions: {
        headerVisible: false
    }
};


const AuthStackRoutes = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
}, headerMode);

const mainStack = createStackNavigator({
    Home: Home,
    Trips: Trips,
    AddMembers: AddMembers
}, headerMode)

const AppNavigator = createDrawerNavigator({
    MainStack: mainStack
}, Object.assign({contentComponent: props => <SideBar {...props}/>},headerMode));

const AppContainer = createAppContainer(createSwitchNavigator(
    {   
        AuthMiddleware: AuthMiddleware,
        Auth: AuthStackRoutes,
        App: AppNavigator
    },
    {
        initialRouteName: 'AuthMiddleware'
    }
));


export default AppContainer;