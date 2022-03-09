// Importing react native components and icons
import "react-native-gesture-handler";
import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Importing screens
import FriendStackNavigator from "./friendStackNavigator";
import FindFriendStackNavigator from "./findFriendStackNavigator";
import SettingsStackNavigator from "./settingsStackNavigator";
import HomeStackNavigator from "./homeStackNavigator";

// Create a tab navigator
const Tab = createBottomTabNavigator();

class App extends Component {
  render() {
    return (
      // Create tab navigator with Home, Friends, Find Friends and Settings 
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            /* Icons switches and becomes highlighted depending on whether or not they
             * focused on that tab or not
             */
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Friends") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Find Friends") {
              iconName = focused ? "person-add" : "person-add-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }

            // Sets the icon name, size and colour of the tab icons
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "darkcyan",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        {/* Displays the Home, Friends, Find Friends and Settings nested navigators 
            inside the tab navigator
         */}
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Friends" component={FriendStackNavigator} />
        <Tab.Screen name="Find Friends" component={FindFriendStackNavigator} />
        <Tab.Screen name="Settings" component={SettingsStackNavigator} />
      </Tab.Navigator>
    );
  }
}

export default App;
