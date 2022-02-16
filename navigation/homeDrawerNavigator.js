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
import LoginStackNavigator from './loginStackNavigator';

const Drawer = createDrawerNavigator();

class HomeStackNavigator extends Component{
    render(){
        return (
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={BottomTabNavigator} />
                <Drawer.Screen name="Edit Profile" component={EditProfileScreen} />
                <Drawer.Screen name="Login" component={LoginStackNavigator} />
                <Drawer.Screen name="Logout" component={LogoutScreen} />
            </Drawer.Navigator>
        );
    }
}

export default HomeStackNavigator;