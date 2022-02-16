import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/home';
import FriendsScreen from './screens/friends';
import FindFriendsScreen from './screens/findFriends';
import FriendRequestsScreen from './screens/friendRequests';
import FriendStackNavigator from './friendStackNavigator';

const Tab = createBottomTabNavigator()

class App extends Component{
    render(){
        return (
            <Tab.Navigator screenOptions={{
                headerShown: false,
              }}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Friends" component={FriendStackNavigator} />
                <Tab.Screen name="Find Friends" component={FindFriendsScreen} />
                <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
            </Tab.Navigator>
        );
    }
}

export default App;