import Reducer from './reducer/Reducer';
import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

const persistConfig = {
    key: 'THEOS',
    storage,
    whitelist:["Reducer"]
  }

  const rootReducer = combineReducers({
    Reducer: Reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)



export const configureStore = createStore(persistedReducer);
export const presistedStore = persistStore(configureStore);
// export default {configureStore,
//     persister: persistStore(configureStore)

// };


