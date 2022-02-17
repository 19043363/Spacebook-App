import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';

const Stack = createStackNavigator()

class LoginStackNavigator extends Component{
    render(){
        return (
            <Stack.Navigator 
                screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
            </Stack.Navigator>
        );
    }
}

export default LoginStackNavigator;