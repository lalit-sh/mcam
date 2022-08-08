import React, { Component } from 'react';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import Navigation from "./utils/routes";
import Store from "./redux/store";
import Loading from "./shared/Loading";
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from  "react-native-splash-screen";
import { firebaseBackgroundMessage } from "./utils/BackgroundFBMessage";
import { AppRegistry } from "react-native"; 
import IntroScreen from './modules/IntoScreen';
import AsyncStorage from '@react-native-community/async-storage';

const { store, persistor } = Store();

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        isIntroDone: false,
        isMounted: false
      }
  }

  componentDidUpdate(prevProps, prevState) { 
    if(this.state.isMounted && !prevState.isMounted){
      SplashScreen.hide();
    }
  }

  
  async componentDidMount() {
      let isIntroDone = await AsyncStorage.getItem("isIntroDone") == "true";
      this.setState({
        isIntroDone,
        isMounted: true
      });
  }

  handleIntroDone = async () => {
    await AsyncStorage.setItem("isIntroDone", "true");
    this.setState({isIntroDone: true});
  }

  render() {
    
    if(!this.state.isIntroDone &&  this.state.isMounted){
      return <IntroScreen onDone={this.handleIntroDone}/>
    }

    return (
      <MenuProvider backHandler={true}>
        <Provider store={store}>
            <PersistGate loading={<Loading />} persistor={persistor}>
                <Navigation />
            </PersistGate>
        </Provider>
      </MenuProvider>
    );
  }
}

AppRegistry.registerComponent('ReactNativeFirebaseDemo', () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebaseBackgroundMessage.bind(null, store)); 
export default App;