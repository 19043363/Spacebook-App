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

  render() {
    return (
      <ScrollView>
        <Text style={GlobalStyles.headerText}>Sign up</Text>
        <Text style={GlobalStyles.headerText}>Welcome to Spacebook!</Text>
        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          style={GlobalStyles.userDataTextBox}
        />
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          style={GlobalStyles.userDataTextBox}
        />
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={GlobalStyles.userDataTextBox}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={GlobalStyles.userDataTextBox}
        />
        <Button title="Create an account" onPress={() => this.signup()} />
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
