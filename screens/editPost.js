import React, { Component } from "react";
import { Button, ScrollView, View, Text, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Title, Subtitle, BodyText, InputTextBox, ErrorText, InputPostTextBox, LoadingView } from "../styles/styles";

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userId: "",
      origText: "",
      text: "",
    };
  }

  componentDidMount() {
    const { post_id } = this.props.route.params;

    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getPostData(post_id);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getPostData = async (post_id) => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id,
      {
        method: "get",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
        } else if (response.status === 403) {
          throw "Can only view the posts of yourself or your friends";
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
          origText: responseJson.text,
          text: responseJson.text,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updatePost = async (post_id) => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    let to_send = {};

    if (this.state.text != this.state.origText) {
      to_send["text"] = this.state.text;
    }

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id,
      {
        method: "PATCH",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(to_send),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("Item updated");
          return response.json();
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
        } else if (response.status === 403) {
          throw "You can only update your own posts";
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("@session_token");
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    const { post_id } = this.props.route.params;

    if (this.state.isLoading) {
      return (
        <LoadingView>
          <BodyText>Loading..</BodyText>
        </LoadingView>
      );
    } else {
      return (
        <ScrollView>
          <Subtitle>Edit Post</Subtitle>
          <InputPostTextBox
            placeholder={"Edit your Post"}
            multiline={true}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />

          <Button title="Update" onPress={() => this.updatePost(post_id)} />

          <Button
            title="Return to Home"
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </ScrollView>
      );
    }
  }
}

export default EditProfileScreen;
