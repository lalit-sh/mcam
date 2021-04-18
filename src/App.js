import React, { Component } from 'react';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import Navigation from "./utils/routes";
import Store from "./redux/store";
import Loading from "./shared/Loading";
import { MenuProvider } from 'react-native-popup-menu';
import { firebaseBackgroundMessage } from "./utils/BackgroundFBMessage";
import { AppRegistry } from "react-native"; 

const { store, persistor } = Store();

class App extends Component {
  constructor(props) {
      super(props);
  }

  render() {
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