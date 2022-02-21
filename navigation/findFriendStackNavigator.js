import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import FindFriendsScreen from './screens/findFriends';
import FriendRequestsScreen from './screens/friendRequests';

const Stack = createStackNavigator()

class App extends Component{
    render(){
        return (
            <Stack.Navigator>
                <Stack.Screen name="Find Friends" component={FindFriendsScreen} />
                <Stack.Screen name="Friend Requests" component={FriendRequestsScreen} />
            </Stack.Navigator>
        );
    }
}

export default App;