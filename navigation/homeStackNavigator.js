import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';


import HomeScreen from './screens/home';
import EditProfileScreen from './screens/editProfile';
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
                <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
                <Stack.Screen name="Edit Post" component={EditPostScreen} />
                <Stack.Screen name="Friends" component={FriendsScreen} />
                <Stack.Screen name="Friend Profile" component={FriendProfileScreen} />
            </Stack.Navigator>
        );
    }
}

export default HomeStackNavigator;