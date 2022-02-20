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
import SettingsScreen from './screens/settings';
import FindFriendStackNavigator from './findFriendStackNavigator';
import SettingsStackNavigator from './settingsStackNavigator';
import HomeStackNavigator from './homeStackNavigator';

const Tab = createBottomTabNavigator()

class App extends Component{
    render(){
        return (
            <Tab.Navigator screenOptions={{
                headerShown: false,
              }}>
                <Tab.Screen name="Home" component={HomeStackNavigator} />
                <Tab.Screen name="Friends" component={FriendStackNavigator} />
                <Tab.Screen name="Find Friends" component={FindFriendStackNavigator} />
                <Tab.Screen name="Settings" component={SettingsStackNavigator} />
            </Tab.Navigator>
        );
    }
}

export default App;