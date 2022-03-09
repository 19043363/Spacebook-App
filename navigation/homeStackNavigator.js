// Importing react native components and icons
import "react-native-gesture-handler";
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Importing screens
import HomeScreen from "../screens/home";
import TakePhotoScreen from "../screens/takePhoto";
import EditProfileScreen from "../screens/editProfile";
import EditPostScreen from "../screens/editPost";
import FriendsScreen from "../screens/friends";
import FriendProfileScreen from "../screens/friendProfile";

// Create a stack navigator
const Stack = createStackNavigator();

class HomeStackNavigator extends Component {
  render() {
    return (
      // Create Home, Take Photo, Edit Post, Friends and Friend Profile screens in a stack
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Take Photo" component={TakePhotoScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
        <Stack.Screen name="Edit Post" component={EditPostScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="Friend Profile" component={FriendProfileScreen} />
      </Stack.Navigator>
    );
  }
}

export default HomeStackNavigator;
