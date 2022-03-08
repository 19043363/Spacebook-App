// Importing react native components
import React, { Component } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing styles
import {
  BodyText,
  Button,
  ButtonContainer,
  ButtonText,
  Container,
  LoadingView,
} from "../styles/styles";

class FriendRequestsScreen extends Component {
  constructor(props) {
    super(props);

    // Set default loading state
    this.state = {
      isLoading: true,
    };
  }

  // Check if user is logged in and is called after the page is rendered and get data
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getData();
    });
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Getting loading data
  getData = async () => {
    this.setState({
      isLoading: false,
    });
  };

  // Check if user has been logged in
  checkLoggedIn = async () => {
    // Gets token from async storage
    const value = await AsyncStorage.getItem("@session_token");

    // If the auth token is empty, navigate to login screen
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    // Navigation command efficiency
    const nav = this.props.navigation;

    // If page is loading, return loading screen
    if (this.state.isLoading) {
      return (
        <LoadingView>
          <BodyText>Loading..</BodyText>
        </LoadingView>
      );
      // Else render page
    } else {
      return (
        /* Set a scroll view so page contents don't overflow off
         * Set a container so page contents aren't on the edge of the page
         */
        <ScrollView>
          <Container>
            {/* Button to navigate to edit profile */}
            <ButtonContainer>
              <Button onPress={() => nav.navigate("Edit Profile")}>
                <ButtonText> Edit Profile </ButtonText>
              </Button>
            </ButtonContainer>
          </Container>
        </ScrollView>
      );
    }
  }
}

export default FriendRequestsScreen;
