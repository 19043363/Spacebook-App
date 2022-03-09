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
  InputPostTextBox,
  LoadingView,
  Subtitle,
} from "../styles/styles";

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);

    // Set default user id, original post text, new post text and loading states
    this.state = {
      isLoading: true,
      userId: "",
      origText: "",
      text: "",
    };
  }

  // Check if user is logged in and is called after the page is rendered and get post
  componentDidMount() {
    // Get post id and user id from route params
    const { post_id, user_id } = this.props.route.params;

    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getPostData(post_id, user_id);
    });
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Get user's post data function
  getPostData = async (post_id, user_id) => {
    // Gets auth token from async storage
    const token = await AsyncStorage.getItem("@session_token");

    // Get single post info
    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id,
      {
        method: "get",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        // Status 200 successfully got post info
        if (response.status === 200) {
          return response.json();

          // Status 401 throws unauthorised access and navigate to login page
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";

          // Status 403 throws can only view posts of yourself and friends
        } else if (response.status === 403) {
          throw "Can only view the posts of yourself or your friends";

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
        // Set original post text, new post text state and page loading to false
        this.setState({
          isLoading: false,
          origText: responseJson.text,
          text: responseJson.text,
        });
      })

      // Displays what error occured in the console
      .catch((error) => {
        console.log(error);
      });
  };

  // Update user's post function
  updatePost = async (post_id, user_id) => {
    // Gets auth token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Navigation command efficiency
    const nav = this.props.navigation;

    // Initialise default info toSend variable to send to API server
    let toSend = {};

    // If new post text not same as original post text, set toSend as new text
    if (this.state.text != this.state.origText) {
      toSend["text"] = this.state.text;
    }

    // Patching (editing) user's post
    return (
      fetch(
        "http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id,
        {
          method: "PATCH",
          headers: {
            "X-Authorization": token,
            "Content-Type": "application/json",
          },

          // Convert user's info states to JSON string
          body: JSON.stringify(toSend),
        }
      )
        .then((response) => {
          /* Status 200 successfully change post text
           * If editing user's own post, navigate back to home
           * Else editing post on friend's page, navigate back to friend's page
           */
          if (response.status === 200) {
            if (user_id == id) {
              nav.navigate("Home");
            } else {
              nav.navigate("Friend Profile", {
                user_id: user_id,
              });
            }
            return response.json();

            // Status 400 throws bad request
          } else if (response.status === 400) {
            throw "Bad request";

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            nav.navigate("Login");
            throw "Unauthorized";

            // Status 403 throws user is already added as a friend
          } else if (response.status === 403) {
            throw "You can only update your own posts";

            // Status 500 throws server error
          } else if (response.status === 500) {
            throw "Server error";

            // Throws 'something went wrong' for other errors
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

  // Check if user has been logged in
  checkLoggedIn = async () => {
    // Gets token from async storage
    const value = await AsyncStorage.getItem("@session_token");

    // If the auth token is empty, navigate to login screen
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    // Navigation command efficiency
    const nav = this.props.navigation;

    // Get post id and user id from route params
    const { post_id, user_id } = this.props.route.params;

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
            <Subtitle>Edit Post</Subtitle>

            {/* Input text box for editing post and setting new text state */}
            <InputPostTextBox
              placeholder={"Edit your Post"}
              multiline={true}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />

            {/* Update post button */}
            <ButtonContainer>
              <Button onPress={() => this.updatePost(post_id, user_id)}>
                <ButtonText> Update </ButtonText>
              </Button>
            </ButtonContainer>

            {/* Navigate back to home button */}
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
}

export default EditProfileScreen;
