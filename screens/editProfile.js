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
  ErrorText,
  InputTextBox,
  LoadingView,
  Subtitle,
} from "../styles/styles";

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);

    /* Set default states for original user info and changed user info
     * Set default states for email and password validations
     */
    this.state = {
      isLoading: true,
      userId: "",
      origFirstName: "",
      origLastName: "",
      origEmail: "",

      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",

      differentPasswords: false,
      invalidEmailOrPassword: false,
    };
  }

  // Check if user is logged in and is called after the page is rendered and get user's data
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getUserData();
    });
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Get user's data function
  getUserData = async () => {
    // Gets auth token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Getting user's info
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id, {
        method: "get",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully got user's info
          if (response.status === 200) {
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 404 throws not found
          } else if (response.status === 404) {
            throw "Not found";

            // Status 500 throws server error
          } else if (response.status === 500) {
            throw "Server error";

            // Throws 'something went wrong' for other errors
          } else {
            throw "Something went wrong";
          }
        })

        .then((responseJson) => {
          // Set states for user's original info and loading state
          this.setState({
            isLoading: false,
            userId: responseJson.user_id,
            origFirstName: responseJson.first_name,
            origLastName: responseJson.last_name,
            origEmail: responseJson.email,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Update user's info function
  updateUserData = async () => {
    // Gets auth token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Initialise default info toSend variable to send to API server
    let toSend = {};

    // If first name is empty, set new first name to original first name
    if (this.state.firstName == "") {
      toSend["first_name"] = this.state.origFirstName;

      // If first name is not same as original name, set user's input for new first name
    } else if (this.state.firstName != this.state.origFirstName) {
      toSend["first_name"] = this.state.firstName;
    }

    // If last name is empty, set new last name to original last name
    if (this.state.lastName == "") {
      toSend["last_name"] = this.state.origLastName;

      // If last name is not same as original name, set user's input for new last name
    } else if (this.state.lastName != this.state.origLastName) {
      toSend["last_name"] = this.state.lastName;
    }

    // If email is empty, set new email to original email
    if (this.state.email == "") {
      toSend["email"] = this.state.origEmail;

      // If email is not same as original email, set user's input for new email
    } else if (this.state.email != this.state.origEmail) {
      toSend["email"] = this.state.email;
    }

    // If password is not same as original password, set password to new password
    if (this.state.password != this.state.origPassword) {
      toSend["password"] = this.state.password;
    }

    // Patching (editing) the user's data function
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id, {
        method: "PATCH",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },

        // Convert user's info states to JSON string
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          // Status 200 user has successfully changed their info and navigate back home
          if (response.status === 200) {
            this.props.navigation.navigate("Home");

            /* Status 400 checks for bad requests
             * Server checks for valid email and password greater than 5 characters
             * Set state invalid email or password to true if invalid
             * Throws failed validation
             */
          } else if (response.status === 400) {
            this.setState({
              invalidEmailOrPassword: true,
            });
            throw "Bad request";

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 403 throws forbidden
          } else if (response.status === 403) {
            throw "Forbidden";

            // Status 404 throws not found
          } else if (response.status === 404) {
            throw "Not found";

            // Status 500 throws server error
          } else if (response.status === 500) {
            throw "Server error";
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
      // Call update user data function to attempt to update user data
      this.updateUserData();
    }
  }

  // Check for invalid inputs or bad requests and displays error on screen
  checkInvalidInput() {
    // Displays error for different passwords if true
    if (this.state.differentPasswords === true) {
      return <ErrorText>Passwords do not match.</ErrorText>;

      // Displays error for invalid email or password if true
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

  // Check if user has been logged in
  checkLoggedIn = async () => {
    // Gets auth token from async storage
    const value = await AsyncStorage.getItem("@session_token");

    // If the auth token is empty, navigate to login screen
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
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
            {/* Headers for page */}
            <Subtitle>Edit Profile</Subtitle>

            {/* Input text box for user's first name and set state to user's new first name */}
            <BodyText>First Name</BodyText>
            <InputTextBox
              placeholder={this.state.origFirstName}
              onChangeText={(firstName) => this.setState({ firstName })}
              value={this.state.firstName}
            />

            {/* Input text box for user's last name and set state to user's new last name */}
            <BodyText>Last Name</BodyText>
            <InputTextBox
              placeholder={this.state.origLastName}
              onChangeText={(lastName) => this.setState({ lastName })}
              value={this.state.lastName}
            />

            {/* Input text box for user's email and set state to user's new email */}
            <BodyText>Email</BodyText>
            <InputTextBox
              placeholder={this.state.origEmail}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />

            {/* Input text box for user's password and set state to user's new password */}
            <BodyText>Password</BodyText>
            <InputTextBox
              placeholder={"New Password"}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />

            {/* Input text box for user's confirm password and set state to user's confirm password */}
            <BodyText>Confirm Password</BodyText>
            <InputTextBox
              placeholder={"Confirm Password"}
              secureTextEntry
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword })
              }
              value={this.state.confirmPassword}
            />

            {/* Error displays if email or password is invalid */}
            {this.checkInvalidInput()}

            {/* Button which calls form validation function to validate and change user's info */}
            <ButtonContainer>
              <Button onPress={() => this.formValidation()}>
                <ButtonText> Update </ButtonText>
              </Button>
            </ButtonContainer>
          </Container>
        </ScrollView>
      );
    }
  }
}

export default EditProfileScreen;
