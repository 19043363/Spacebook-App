import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/home';
import EditPostScreen from './screens/editPost';
import FriendsScreen from './screens/friends';
import FriendProfileScreen from './screens/friendProfile';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

class HomeStackNavigator extends Component{
    render(){
        return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Edit Post" component={EditPostScreen} />
                <Stack.Screen name="Friends" component={FriendsScreen} />
                <Stack.Screen name="Friend Profile" component={FriendProfileScreen} />
            </Stack.Navigator>
        );
    }
}

export default HomeStackNavigator;