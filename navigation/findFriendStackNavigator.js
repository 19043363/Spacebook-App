// Importing react native components
import "react-native-gesture-handler";
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importing screens
import FindFriendsScreen from "../screens/findFriends";
import FriendRequestsScreen from "../screens/friendRequests";

// Create a stack navigator
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      // Create stack navigator with Find Friends and Friend Requests screens
      <Stack.Navigator>
        <Stack.Screen name="Find Friends" component={FindFriendsScreen} />
        <Stack.Screen name="Friend Requests" component={FriendRequestsScreen} />
      </Stack.Navigator>
    );
  }
}

export default App;
