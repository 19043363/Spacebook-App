import React, { Component } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

    this.state = {
      token: "",
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    if (value !== null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate("Login");
    }
  };

  logout = async () => {
    let token = await AsyncStorage.getItem("@session_token");
    await AsyncStorage.removeItem("@session_token");
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "post",
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  render() {
    const nav = this.props.navigation;

    return (
      <ScrollView>
        <Container>
          <Subtitle>
            If you leave me now, you'll take away the biggest part of me...
          </Subtitle>
          <Subtitle>...Oooooohh, please don't go!</Subtitle>

          <ButtonContainer>
            <Button onPress={() => this.logout()}>
              <ButtonText> Logout </ButtonText>
            </Button>
          </ButtonContainer>

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
