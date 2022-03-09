// Importing react native components
import "react-native-gesture-handler";
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importing screens
import LoginScreen from "../screens/login";
import SignupScreen from "../screens/signup";

// Create a stack navigator
const Stack = createStackNavigator();

class LoginStackNavigator extends Component {
  render() {
    return (
      // Create a stack navigator with Login and Signup screen
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    );
  }
}

export default LoginStackNavigator;
