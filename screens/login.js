import React, { Component } from "react";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Title,
  BodyText,
  InputTextBox,
  ErrorText,
  Button,
  ButtonContainer,
  ButtonText,
} from "../styles/styles";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",

      checkInvalidInput: false,
    };
  }

  login = async () => {
    //Validation here...

    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          this.setState({
            checkInvalidInput: true,
          });
          throw "Invalid email/password supplied";
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
      })
      .then(async (responseJson) => {
        await AsyncStorage.setItem("@session_token", responseJson.token);
        await AsyncStorage.setItem("user_id", responseJson.id);
        this.props.navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkInvalidInput() {
    if (this.state.checkInvalidInput === true) {
      return <ErrorText>Invalid email/password supplied </ErrorText>;
    }
    return null;
  }

  render() {
    const nav = this.props.navigation;

    return (
      <ScrollView>
        <Title>Login</Title>

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

        {this.checkInvalidInput()}

        <ButtonContainer>
          <Button onPress={() => this.login()}>
            <ButtonText> Login </ButtonText>
          </Button>
        </ButtonContainer>

        <ButtonContainer>
          <Button onPress={() => nav.navigate("Signup")}>
            <ButtonText> Don't have an account? </ButtonText>
          </Button>
        </ButtonContainer>
      </ScrollView>
    );
  }
}

export default LoginScreen;
