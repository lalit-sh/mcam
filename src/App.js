import React, { Component } from 'react';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import Navigation from "./utils/routes";
import Store from "./redux/store";
import Loading from "./shared/Loading";
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from  "react-native-splash-screen";

const { store, persistor } = Store();

export default class App extends Component {
  constructor(props) {
      super(props);
  }
  componentDidMount() {
      SplashScreen.hide();
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
