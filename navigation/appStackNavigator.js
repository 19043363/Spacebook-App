import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import EditProfileScreen from './screens/editProfile';
import LogoutScreen from './screens/logout';
import BottomTabNavigator from './bottomTabNavigator';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

class HomeStackNavigator extends Component{
    render(){
        return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={BottomTabNavigator} />
                <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
                <Stack.Screen name="Logout" component={LogoutScreen} />
            </Stack.Navigator>
        );
    }
}

export default HomeStackNavigator;