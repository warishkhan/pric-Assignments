import {View, Text} from 'react-native';
import React from 'react';
import AppContainer from './navigator/index';
import {Provider} from 'react-redux';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;
