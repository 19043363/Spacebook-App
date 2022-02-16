import 'react-native-gesture-handler';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, FlatList} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './navigation/screens/home';
import LoginScreen from './navigation/screens/login';
import SignupScreen from './navigation/screens/signup';
import EditProfileScreen from './navigation/screens/editProfile';
import FriendsScreen from './navigation/screens/friends';
import FindFriendsScreen from './navigation/screens/findFriends';
import FriendRequestsScreen from './navigation/screens/friendRequests';
import FriendProfileScreen from './navigation/screens/friendProfile';
import LogoutScreen from './navigation/screens/logout';
import BottomTabNavigator from './navigation/bottomTabNavigator';
import LoginStackNavigator from './navigation/loginStackNavigator';
import HomeDrawerNavigator from './navigation/homeDrawerNavigator';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

class App extends Component{

    render(){
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home"
                    screenOptions={{
                    headerShown: false
                  }}>
                    <Stack.Screen name="Home" component={BottomTabNavigator} />
                    <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
                    <Stack.Screen name="Login" component={LoginStackNavigator} />
                    <Stack.Screen name="Logout" component={LogoutScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;