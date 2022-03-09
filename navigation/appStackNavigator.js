// Importing react native components
import "react-native-gesture-handler";
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importing screens
import LogoutScreen from "../screens/logout";
import BottomTabNavigator from "../bottomTabNavigator";

// Create a stack navigator
const Stack = createStackNavigator();

class HomeStackNavigator extends Component {
  render() {
    return (
      // Create a stack navigator with nested bottom navigator
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        <Stack.Screen name="Logout" component={LogoutScreen} />
      </Stack.Navigator>
    );
  }
}

export default HomeStackNavigator;
