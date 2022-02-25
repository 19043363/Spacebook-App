import "react-native-gesture-handler";
import React, { Component } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LogoutScreen from "./screens/logout";
import BottomTabNavigator from "./navigation/bottomTabNavigator";
import LoginStackNavigator from "./navigation/loginStackNavigator";

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
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
