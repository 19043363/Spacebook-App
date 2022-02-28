import React, { Component } from "react";
import { Button, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../styles/globalStyles";

class FriendRequestsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    
    this.setState({
      isLoading: false,
    });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={GlobalStyles.loading}>
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Button
            title="Edit Profile"
            onPress={() => this.props.navigation.navigate("Edit Profile")}
          />
        </View>
      );
    }
  }
}

export default FriendRequestsScreen;
