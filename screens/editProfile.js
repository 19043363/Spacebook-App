import React, { Component } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getUserData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getUserData = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: "get",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
        } else if (response.status === 404) {
          throw "Not found";
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userId: responseJson.user_id,
          origFirstName: responseJson.first_name,
          origLastName: responseJson.last_name,
          origEmail: responseJson.email,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateUserData = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    let to_send = {};

    if (this.state.firstName == "") {
      to_send["first_name"] = this.state.origFirstName;
    } else if (this.state.firstName != this.state.origFirstName) {
      to_send["first_name"] = this.state.firstName;
    }

    if (this.state.lastName == "") {
      to_send["last_name"] = this.state.origLastName;
    } else if (this.state.lastName != this.state.origLastName) {
      to_send["last_name"] = this.state.lastName;
    }

    if (this.state.email == "") {
      to_send["email"] = this.state.origEmail;
    } else if (this.state.email != this.state.origEmail) {
      to_send["email"] = this.state.email;
    }

    if (this.state.password != this.state.origPassword) {
      to_send["password"] = this.state.password;
    }

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
      method: "PATCH",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate("Home");
        } else if (response.status === 400) {
          this.setState({
            invalidEmailOrPassword: true,
          });
          throw "Bad request";
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
        } else if (response.status === 403) {
          throw "Forbidden";
        } else if (response.status === 404) {
          throw "Not found";
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
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
      this.updateUserData();
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingView>
          <BodyText>Loading..</BodyText>
        </LoadingView>
      );
    } else {
      return (
        <ScrollView>
          <Container>
            <Subtitle>Edit Profile</Subtitle>

            <BodyText>First Name</BodyText>
            <InputTextBox
              placeholder={this.state.origFirstName}
              onChangeText={(firstName) => this.setState({ firstName })}
              value={this.state.firstName}
            />

            <BodyText>Last Name</BodyText>
            <InputTextBox
              placeholder={this.state.origLastName}
              onChangeText={(lastName) => this.setState({ lastName })}
              value={this.state.lastName}
            />

            <BodyText>Email</BodyText>
            <InputTextBox
              placeholder={this.state.origEmail}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />

            <BodyText>Password</BodyText>
            <InputTextBox
              placeholder={"New Password"}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />

            <BodyText>Confirm Password</BodyText>
            <InputTextBox
              placeholder={"Confirm Password"}
              secureTextEntry
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword })
              }
              value={this.state.confirmPassword}
            />

            {this.checkInvalidInput()}

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
