import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FriendsScreen from './screens/friends';
import FriendProfileScreen from './screens/friendProfile';

const Stack = createStackNavigator()

class App extends Component{
    render(){
        return (
            <Stack.Navigator>
                <Stack.Screen name="Friends" component={FriendsScreen} />
                <Stack.Screen name="Friend Profile" component={FriendProfileScreen} />
            </Stack.Navigator>
        );
    }
}

export default App;