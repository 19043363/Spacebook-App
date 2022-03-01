import React, { Component } from "react";
import { Button, ScrollView, TextInput, Text } from "react-native";
import GlobalStyles from "../styles/globalStyles";

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
    //Validation here...

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
      return <Text style={GlobalStyles.errorText}>Passwords do not match.</Text>;
    } else if (this.state.invalidEmailOrPassword === true) {
      return (
        <Text style={GlobalStyles.errorText}>
          Email must be valid and password must be greater than 5 characters.
        </Text>
      );
    }
    return null;
  }

  render() {
    return (
      <ScrollView>
        <Text style={GlobalStyles.headerText}>Sign up</Text>
        <Text style={GlobalStyles.headerText}>Welcome to Spacebook!</Text>

        <Text style={GlobalStyles.regularText}>First Name</Text>
        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          style={GlobalStyles.userDataTextBox}
        />
        <Text style={GlobalStyles.regularText}>Last Name</Text>
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          style={GlobalStyles.userDataTextBox}
        />
        <Text style={GlobalStyles.regularText}>Email</Text>
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={GlobalStyles.userDataTextBox}
        />
        <Text style={GlobalStyles.regularText}>Password</Text>
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={GlobalStyles.userDataTextBox}
        />
        <Text style={GlobalStyles.regularText}>Confirm Password</Text>
        <TextInput
          placeholder="Confirm password..."
          onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
          secureTextEntry
          style={GlobalStyles.userDataTextBox}
        />
        {this.checkInvalidInput()}
        <Button
          title="Create an account"
          onPress={() => this.formValidation()}
        />
        <Button
          onPress={() => this.props.navigation.navigate("Login")}
          color="darkblue"
          title="Return to Login Page"
        />
      </ScrollView>
    );
  }
}

export default SignupScreen;
