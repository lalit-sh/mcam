import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "../reducers";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-community/async-storage';
import { logger } from "redux-logger";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ['identity', "users", "trips"]
}

const middleware = [thunk, logger];
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(persistedReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store);
export default () => {
    return { store, persistor};
};
