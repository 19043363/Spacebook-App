import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconName } from "react-icons/io";
import Ionicons from 'react-native-vector-icons/Ionicons';

import FriendStackNavigator from './friendStackNavigator';
import FindFriendStackNavigator from './findFriendStackNavigator';
import SettingsStackNavigator from './settingsStackNavigator';
import HomeStackNavigator from './homeStackNavigator';

const Tab = createBottomTabNavigator()

class App extends Component{
    render(){
        return (
            <Tab.Navigator
            screenOptions=
            {({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Home') {
                  iconName = focused
                    ? 'home'
                    : 'home-outline';
                }else if (route.name === 'Friends') {
                  iconName = focused 
                    ? 'people' 
                    : 'people-outline';
                }else if (route.name === 'Find Friends') {
                    iconName = focused 
                    ? 'person-add' 
                    : 'person-add-outline';
                }else if (route.name === 'Settings') {
                  iconName = focused 
                    ? 'settings' 
                    : 'settings-outline';
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'darkturquoise',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
            >
                <Tab.Screen name="Home" component={HomeStackNavigator} />
                <Tab.Screen name="Friends" component={FriendStackNavigator} />
                <Tab.Screen name="Find Friends" component={FindFriendStackNavigator} />
                <Tab.Screen name="Settings" component={SettingsStackNavigator} />
            </Tab.Navigator>
        );
    }
}

export default App;