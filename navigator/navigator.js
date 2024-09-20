import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../src/screens/Home';
const Stack = createNativeStackNavigator();

const Mainnav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Mainnav;
