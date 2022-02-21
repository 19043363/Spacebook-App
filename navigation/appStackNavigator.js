import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import LogoutScreen from './screens/logout';
import BottomTabNavigator from './bottomTabNavigator';

const Stack = createStackNavigator();

class HomeStackNavigator extends Component{
    render(){
        return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={BottomTabNavigator} />
                <Stack.Screen name="Logout" component={LogoutScreen} />
            </Stack.Navigator>
        );
    }
}

export default HomeStackNavigator;