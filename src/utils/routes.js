import {
    createAppContainer,
    createSwitchNavigator,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from "../modules/Home";
import AuthMiddleware from "./middleware/auth";
import LoginScreen from "../modules/Login";
import Trips from "../modules/Trips"; // trips is used for groups page
import ManageTrip from "../modules/ManageGroups";
import SettingModule from "../modules/Settings";
import CameraSetting from "../modules/Settings/modules/CameraSetting";
import Gallery from "../modules/Gallery";
import OTPVerifyScreen from '../modules/Login/OTPVerifyScreen';

const headerMode = {
    headerMode: "none",
    navigationOptions: {
        headerVisible: false
    }
};


const AuthStackRoutes = createStackNavigator({
    Login: LoginScreen,
    OTPVerifyScreen: OTPVerifyScreen
}, headerMode);

// const Gallery = createBottomTabNavigator({
//     Timeline: GalleryTimelineView,
//     Collection: GalleryCollectionView
// }, {
//     tabBarOptions: {
//         activeTintColor: 'tomato',
//         inactiveTintColor: 'gray',
//         labelStyle: {
//             fontSize: 14
//         }
//     },
// });

const MainStack = createStackNavigator({
    Home: Home,
    Trips: Trips,
    ManageTrip: ManageTrip,
    Settings: SettingModule,
    CameraSetting: CameraSetting,
    Gallery: Gallery
}, headerMode);

const AppContainer = createAppContainer(createSwitchNavigator(
    {   
        AuthMiddleware: AuthMiddleware,
        Auth: AuthStackRoutes,
        App: MainStack
    },
    {
        initialRouteName: 'AuthMiddleware'
    }
));


export default AppContainer;