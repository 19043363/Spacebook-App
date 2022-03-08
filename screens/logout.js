// Importing react native components
import React, { Component } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing styles
import {
  Button,
  ButtonContainer,
  ButtonText,
  Container,
  Subtitle,
} from "../styles/styles";

class LogoutScreen extends Component {
  constructor(props) {
    super(props);

    // Setting default authentification (auth) token state
    this.state = {
      token: "",
    };
  }

  // Check if user is logged in and is called after the page is rendered
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this._unsubscribe();
  }

  // Check if user has been logged in
  checkLoggedIn = async () => {
    // Gets token from async storage
    const value = await AsyncStorage.getItem("@session_token");

    // If the auth value is not empty, set the auth token state to the async token value
    if (value !== null) {
      this.setState({ token: value });

      // If the auth token is empty, navigate to login screen
    } else {
      this.props.navigation.navigate("Login");
    }
  };

  // Logout function
  logout = async () => {
    // Get the auth token from the async storage
    let token = await AsyncStorage.getItem("@session_token");

    // Removes auth token from the async storage
    await AsyncStorage.removeItem("@session_token");

    // Posting the user's choice to logout to the API server and handle errors
    return (
      fetch("http://localhost:3333/api/1.0.0/logout", {
        method: "post",
        headers: {
          "X-Authorization": token,
        },
      })
        .then((response) => {
          // Status 200 user has successfully logged out and navigates to login page
          if (response.status === 200) {
            this.props.navigation.navigate("Login");

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorised";

            // Status 500 throws server error
          } else if (response.status === 500) {
            throw "Server error";

            // Throws 'something went wrong' for other errors
          } else {
            throw "Something went wrong";
          }
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
          ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    );
  };

  render() {
    // Navigation command efficiency
    const nav = this.props.navigation;

    return (
      /* Set a scroll view so page contents don't overflow off
       * Set a container so page contents aren't on the edge of the page
       */
      <ScrollView>
        <Container>
          {/* Headers for page */}
          <Subtitle>
            If you leave me now, you'll take away the biggest part of me...
          </Subtitle>
          <Subtitle>...Oooooohh, please don't go!</Subtitle>

          {/* Button to call logout function */}
          <ButtonContainer>
            <Button onPress={() => this.logout()}>
              <ButtonText> Logout </ButtonText>
            </Button>
          </ButtonContainer>

          {/* Button to navigate back to home */}
          <ButtonContainer>
            <Button onPress={() => nav.navigate("Home")}>
              <ButtonText> Return to Home </ButtonText>
            </Button>
          </ButtonContainer>
        </Container>
      </ScrollView>
    );
  }
}

export default LogoutScreen;
