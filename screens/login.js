// Importing react native components
import React, { Component } from "react";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing styles
import {
  BodyText,
  Button,
  ButtonContainer,
  ButtonText,
  Container,
  ErrorText,
  InputTextBox,
  Title,
} from "../styles/styles";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    // Set default states for user email, password and validation
    this.state = {
      email: "",
      password: "",

      checkInvalidInput: false,
    };
  }

  // Logging in function
  login = async () => {
    // Posting user's email and password to the API server and handle error
    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      // Convert user's email and password states to JSON string
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        // Status 200 successfully logged in
        if (response.status === 200) {
          return response.json();

          /* Status 400 checks for bad requests
           * Server checks if email and password is valid
           * Set state invalid email or password to true if invalid
           * Throws invalid email or password
           */
        } else if (response.status === 400) {
          this.setState({
            checkInvalidInput: true,
          });
          throw "Invalid email/password supplied";

          // Status 500 throws server error
        } else if (response.status === 500) {
          throw "Server error";

          // Throws 'something went wrong' for other errors
        } else {
          throw "Something went wrong";
        }
      })
      .then(async (responseJson) => {
        // Sets auth token and user id
        await AsyncStorage.setItem("@session_token", responseJson.token);
        await AsyncStorage.setItem("user_id", responseJson.id);

        // Navigates to home
        this.props.navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Check for invalid email or password input
  checkInvalidInput() {
    // If invalid, display error message on screen
    if (this.state.checkInvalidInput === true) {
      return <ErrorText>Invalid email/password supplied </ErrorText>;
    }

    // Otherwise return null
    return null;
  }

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
          <Title>Login</Title>

          {/* Input text box for user's email and set state to user's email */}
          <BodyText>Email</BodyText>
          <InputTextBox
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />

          {/* Input text box for user's password and set state to user's password */}
          <BodyText>Password</BodyText>
          <InputTextBox
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
          />

          {/* Error displays if email or password is invalid */}
          {this.checkInvalidInput()}

          {/* Button which calls login function to allow the user to login */}
          <ButtonContainer>
            <Button onPress={() => this.login()}>
              <ButtonText> Login </ButtonText>
            </Button>
          </ButtonContainer>

          {/* Button to navigate to the signup page */}
          <ButtonContainer>
            <Button onPress={() => nav.navigate("Signup")}>
              <ButtonText> Don't have an account? </ButtonText>
            </Button>
          </ButtonContainer>
        </Container>
      </ScrollView>
    );
  }
}

export default LoginScreen;
