import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Mainnav from './navigator';
import AuthNavigator from './authNavigator';

import auth from '@react-native-firebase/auth';
import {StatusBar} from 'react-native';

export default AppContainer = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChange);
    return subscriber;
  }, []);
  if (initializing) return null;

  return (
    <NavigationContainer>
      <StatusBar />
      {user ? <Mainnav /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
