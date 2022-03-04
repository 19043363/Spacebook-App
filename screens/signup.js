import React, { Component } from "react";
import { ScrollView } from "react-native";
import {
  Title,
  Subtitle,
  BodyText,
  InputTextBox,
  ErrorText,
  LoadingView,
  Button,
  ButtonContainer,
  ButtonText,
} from "../styles/styles";

class SignupScreen extends Component {
  constructor(props) {
    super(props);

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

  signup = () => {
    return fetch("http://localhost:3333/api/1.0.0/user", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          this.setState({
            invalidEmailOrPassword: true,
          });
          throw "Failed validation";
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        console.log("User created with ID: ", responseJson);
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  formValidation() {
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        differentPasswords: true,
      });
    } else {
      this.setState({
        differentPasswords: false,
      });
      this.signup();
    }
  }

  checkInvalidInput() {
    if (this.state.differentPasswords === true) {
      return <ErrorText>Passwords do not match.</ErrorText>;
    } else if (this.state.invalidEmailOrPassword === true) {
      return (
        <ErrorText>
          Email must be valid and password must be greater than 5 characters.
        </ErrorText>
      );
    }
    return null;
  }

  render() {
    const nav = this.props.navigation;
    return (
      <ScrollView>
        <Title>Sign up</Title>
        <Subtitle>Welcome to Spacebook!</Subtitle>

        <BodyText>First Name</BodyText>
        <InputTextBox
          placeholder="Enter your first name..."
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
        />
        <BodyText>Last Name</BodyText>
        <InputTextBox
          placeholder="Enter your last name..."
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
        />
        <BodyText>Email</BodyText>
        <InputTextBox
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <BodyText>Password</BodyText>
        <InputTextBox
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
        />
        <BodyText>Confirm Password</BodyText>
        <InputTextBox
          placeholder="Confirm password..."
          onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
          secureTextEntry
        />
        {this.checkInvalidInput()}
        <ButtonContainer>
          <Button onPress={() => this.formValidation()}>
            <ButtonText> Create an account </ButtonText>
          </Button>
        </ButtonContainer>

        <ButtonContainer>
          <Button onPress={() => nav.navigate("Login")}>
            <ButtonText> Return to Login Page </ButtonText>
          </Button>
        </ButtonContainer>
      </ScrollView>
    );
  }
}

export default SignupScreen;
