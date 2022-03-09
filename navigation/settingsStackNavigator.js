// Importing react native components
import "react-native-gesture-handler";
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importing screens
import SettingsScreen from "../screens/settings";
import EditProfileScreen from "../screens/editProfile";

// Create a stack navigator
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      // Create a stack navigator with settings and edit profile screen
      <Stack.Navigator>
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
      </Stack.Navigator>
    );
  }
}

export default App;
