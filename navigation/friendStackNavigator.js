// Importing react native components and icons
import "react-native-gesture-handler";
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importing screens
import FriendsScreen from "../screens/friends";
import FriendProfileScreen from "../screens/friendProfile";

// Create a stack navigator
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      // Create a stack navigator with Friends and Friend Profile screen
      <Stack.Navigator>
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="Friend Profile" component={FriendProfileScreen} />
      </Stack.Navigator>
    );
  }
}

export default App;
