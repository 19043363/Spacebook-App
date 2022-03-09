// Importing react native components
import "react-native-gesture-handler";
import React, { Component } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importing screens
import LogoutScreen from "./screens/logout";
import BottomTabNavigator from "./navigation/bottomTabNavigator";
import LoginStackNavigator from "./navigation/loginStackNavigator";

// Create a stack navigator
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      // Create a stack navigator with nested navigators
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={BottomTabNavigator} />
          <Stack.Screen name="Login" component={LoginStackNavigator} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
