// Importing react native components
import React, { Component } from "react";
import { ScrollView } from "react-native";

// Importing styles
import {
  BodyText,
  Button,
  ButtonContainer,
  ButtonText,
  Container,
  ErrorText,
  InputTextBox,
  Subtitle,
  Title,
} from "../styles/styles";

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    // Setting states for user info and validations (true or false)
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",

      differentPasswords: false,
      invalidEmailOrPassword: false,
    };
  }

  // Posting user's signup info to the API and handle errors
  signup = () => {
    return (
      fetch("http://localhost:3333/api/1.0.0/user", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state),
      })
        .then((response) => {
          // Status 201 user has successfully been created
          if (response.status === 201) {
            this.props.navigation.navigate("Login");
            return response.json();

            /* Status 400 checks for bad requests
             * Server checks for valid email and password greater than 5 characters
             * Set invalid email or password to true if invalid
             */
          } else if (response.status === 400) {
            this.setState({
              invalidEmailOrPassword: true,
            });
            throw "Failed validation";

            // Status 500 throws server error
          } else if (response.status === 500) {
            throw "Server error";

            // Throws 'something went wrong' for unknown error
          } else {
            throw "Something went wrong";
          }
        })
        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Validation to check if password and confirm password are identical
  formValidation() {
    // Sets different passwords to true if passwords are not identical
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        differentPasswords: true,
      });

      // Sets different passwords to false if passwords are identical
    } else {
      this.setState({
        differentPasswords: false,
      });
      // Call signup function to attempt to sign up the user to Spacebook
      this.signup();
    }
  }

  // Check for invalid inputs or bad requests and displays error on screen
  checkInvalidInput() {
    // Displays error for different passwords during signup if true
    if (this.state.differentPasswords === true) {
      return <ErrorText>Passwords do not match.</ErrorText>;

      // Displays error for invalid email or password during signup if true
    } else if (this.state.invalidEmailOrPassword === true) {
      return (
        <ErrorText>
          Email must be valid and password must be greater than 5 characters.
        </ErrorText>
      );
    }

    // Returns null if both are false
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
          <Title>Sign up</Title>
          <Subtitle>Welcome to Spacebook!</Subtitle>

          {/* Input text box for user's first name and set state to user's first name */}
          <BodyText>First Name</BodyText>
          <InputTextBox
            placeholder="Enter your first name..."
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
          />

          {/* Input text box for user's last name and set state to user's last name */}
          <BodyText>Last Name</BodyText>
          <InputTextBox
            placeholder="Enter your last name..."
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
          />

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

          {/* Input text box for user's confirm password and set state to user's confirm password */}
          <BodyText>Confirm Password</BodyText>
          <InputTextBox
            placeholder="Confirm password..."
            onChangeText={(confirmPassword) =>
              this.setState({ confirmPassword })
            }
            value={this.state.confirmPassword}
            secureTextEntry
          />

          {/* Error displays if email or password is invalid */}
          {this.checkInvalidInput()}

          {/* Button which calls form validation function to validate and signup */}
          <ButtonContainer>
            <Button onPress={() => this.formValidation()}>
              <ButtonText> Create an account </ButtonText>
            </Button>
          </ButtonContainer>

          {/* Button to navigate back to login page */}
          <ButtonContainer>
            <Button onPress={() => nav.navigate("Login")}>
              <ButtonText> Return to Login Page </ButtonText>
            </Button>
          </ButtonContainer>

        </Container>
      </ScrollView>
    );
  }
}

export default SignupScreen;
