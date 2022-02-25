import "react-native-gesture-handler";
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FriendsScreen from "../screens/friends";
import FriendProfileScreen from "../screens/friendProfile";

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="Friend Profile" component={FriendProfileScreen} />
      </Stack.Navigator>
    );
  }
}

export default App;
