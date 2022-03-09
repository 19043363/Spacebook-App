// Importing react native components
import React, { Component } from "react";
import { View, FlatList } from "react-native";

// Importing styles
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  BodyText,
  Button,
  ButtonContainer,
  ButtonText,
  Container,
  IconButton,
  InputPostTextBox,
  LoadingView,
  PostInteractionButtonContainer,
  PostTextBox,
  ProfileContainer,
  ProfilePhoto,
  RowContainer,
  ScrollView,
} from "../styles/styles";

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    // Set default user info, post data and loading states
    this.state = {
      isLoading: true,
      userPhoto: "",
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      friendCount: "",

      text: "",
      postData: [],
    };
  }

  /* Check if user is logged in and is called after the page is rendered
   * Get user info, profile photo and post info
   */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getUserData();
      this.getUserProfilePhoto();
      this.getPostData();
    });
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Get user's data function
  getUserData = async () => {
    // Gets token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Get user's data from API server
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id, {
        method: "get",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully got friend's info
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
          // Set states for user's data and loading state
          this.setState({
            isLoading: false,
            userId: responseJson.user_id,
            firstName: responseJson.first_name,
            lastName: responseJson.last_name,
            email: responseJson.email,
            friendCount: responseJson.friend_count,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Get user's profile photo function
  getUserProfilePhoto = async () => {
    // Gets auth token and user's id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Gets user's profile photo
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
        method: "get",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully got user's profile photo
          if (response.status === 200) {
            return response.blob();

            // Status 400 throws bad request
          } else if (response.status === 400) {
            throw "Bad request";

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
          } else {
            throw "Something went wrong";
          }
        })
        .then((responseBlob) => {
          // Create data variable for image
          let data = URL.createObjectURL(responseBlob);

          // Set user's photo and loading screen to false
          this.setState({
            userPhoto: data,
            isLoading: false,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Get friend's post data function
  getPostData = async () => {
    // Gets auth token and user's id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Get user's post info
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
        method: "get",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully got list of friend's posts
          if (response.status === 200) {
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 403 throws can only view posts of yourself or your friends
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
          // Set state for list of post data and loading screen state to false
          this.setState({
            isLoading: false,
            postData: responseJson,
          });
        })
        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Posting a new post to home page function
  addPost = async () => {
    // Gets auth token from async storage and friend's id from route params
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Initialise default info toSend variable to send to API server
    let toSend = {
      text: this.state.text,
    };

    // Sends post text to API server on the user's page
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
        method: "post",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
      })
        .then((response) => {
          // Status 201 successfully created new post and refreshes post data on page
          if (response.status === 201) {
            this.getPostData();
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
          // Set loading state to false
          this.setState({
            isLoading: false,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Deleting a post from home page function
  removePost = async (post_id) => {
    // Gets auth token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Deleting post in API server
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
        method: "delete",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully deleted post and refreshes post data on page
          if (response.status === 200) {
            this.getPostData();
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 403 throws forbidden you can only delete your own posts
          } else if (response.status === 403) {
            throw "You can only delete your own posts";

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

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Posting a like to a user's post function
  likeFriendPost = async (post_id) => {
    // Gets auth token from async storage and friend's id from route params
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Posting a like to a post to the API server
    return (
      fetch(
        "http://localhost:3333/api/1.0.0/user/" +
          id +
          "/post/" +
          post_id +
          "/like",
        {
          method: "post",
          headers: {
            "X-Authorization": token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          // Status 200 successfully liked post and refreshes post data on page
          if (response.status === 200) {
            this.getPostData();
            return response.json();

            // Status 400 throws bad request you have already liked this post
          } else if (response.status === 400) {
            throw "You have already liked this post";

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 403 throws forbidden you have already liked this post
          } else if (response.status === 403) {
            throw "You have already liked this post";

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
          // Set loading state to false
          this.setState({
            isLoading: false,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Remove like from friend's post function
  removeLikeFromFriendPost = async (post_id) => {
    // Gets auth token from async storage and user's id from route params
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Deleting like on a post in the API server
    return (
      fetch(
        "http://localhost:3333/api/1.0.0/user/" +
          id +
          "/post/" +
          post_id +
          "/like",
        {
          method: "delete",
          headers: {
            "X-Authorization": token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          // Status 200 successfully removed like from post and refreshes post data on page
          if (response.status === 200) {
            this.getPostData();
            return response.json();

            // Status 400 throws forbidden you have not liked this post
          } else if (response.status === 400) {
            throw "You have not liked this post";

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 403 throws forbidden you have not liked this post
          } else if (response.status === 403) {
            throw "You have not liked this post";

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
          // Set loading state to false
          this.setState({
            isLoading: false,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

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
    // Navigation command efficiency
    const nav = this.props.navigation;

    // Default icon button size
    const buttonSize = 28;

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
        <ScrollView>
          <Container>
            {/* Profile horizontal container */}
            <ProfileContainer>
              {/* Display user's profile photo */}
              <ProfilePhoto
                source={{
                  uri: this.state.userPhoto,
                }}
              />

              {/* Display user's info */}
              <BodyText>
                {this.state.firstName} {this.state.lastName} {"\n"}
                {this.state.email} {"\n"}
                Friends: {this.state.friendCount}
              </BodyText>
            </ProfileContainer>

            {/* Take photo button to navigate to take photo page */}
            <RowContainer>
              <ButtonContainer>
                <Button onPress={() => nav.navigate("Take Photo")}>
                  <ButtonText> Take Photo </ButtonText>
                </Button>
              </ButtonContainer>

              {/* Friends button to navigate to friends list page */}
              <ButtonContainer>
                <Button onPress={() => nav.navigate("Friends")}>
                  <ButtonText> Friends </ButtonText>
                </Button>
              </ButtonContainer>

              {/* Edit profile button to navigate to edit profile page */}
              <ButtonContainer>
                <Button onPress={() => nav.navigate("Edit Profile")}>
                  <ButtonText> Edit Profile </ButtonText>
                </Button>
              </ButtonContainer>

              {/* Logout button to navigate to logout page */}
              <ButtonContainer>
                <Button onPress={() => nav.navigate("Logout")}>
                  <ButtonText> Logout </ButtonText>
                </Button>
              </ButtonContainer>
            </RowContainer>

            {/* Input text box for post text and set text state to user's input */}
            <InputPostTextBox
              placeholder="What's on your mind today?"
              multiline={true}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />

            {/* Button to post the post onto user's wall */}
            <ButtonContainer>
              <Button onPress={() => this.addPost()}>
                <ButtonText> Post </ButtonText>
              </Button>
            </ButtonContainer>

            {/* Display all of user's posts on their wall */}
            <FlatList
              data={this.state.postData}
              renderItem={({ item }) => (
                <View>
                  {/* Display post text */}
                  <PostTextBox>{item.text} </PostTextBox>

                  {/* Display post author and number of likes */}
                  <RowContainer>
                    <BodyText>
                      {item.author.first_name} {item.author.last_name}
                      {"\n"}
                      {item.numLikes} Likes{" "}
                    </BodyText>

                    {/* If user's post, show delete and edit post button */}
                    {item.author.user_id == this.state.userId ? (
                      <PostInteractionButtonContainer>
                        {/* Delete button with bin icon */}
                        <IconButton
                          onPress={() => this.removePost(item.post_id)}
                        >
                          <View>
                            <Ionicons
                              name={"trash-bin"}
                              size={buttonSize}
                              color={"black"}
                            />
                          </View>
                        </IconButton>

                        {/* Edit post button with edit post icon */}
                        <IconButton
                          onPress={() =>
                            nav.navigate("Edit Post", {
                              post_id: item.post_id,
                              user_id: this.state.userId,
                            })
                          }
                        >
                          <View>
                            <Ionicons
                              name={"create-outline"}
                              size={buttonSize}
                              color={"black"}
                            />
                          </View>
                        </IconButton>
                      </PostInteractionButtonContainer>
                    ) : (
                      // Else show like and remove like button
                      <PostInteractionButtonContainer>
                        {/* Like button with heart icon */}
                        <IconButton
                          onPress={() => this.likeFriendPost(item.post_id)}
                        >
                          <View>
                            <Ionicons
                              name={"heart"}
                              size={buttonSize}
                              color={"firebrick"}
                            />
                          </View>
                        </IconButton>

                        {/* Remove like button with unlike icon */}
                        <IconButton
                          onPress={() =>
                            this.removeLikeFromFriendPost(item.post_id)
                          }
                        >
                          <View>
                            <Ionicons
                              name={"heart-dislike"}
                              size={buttonSize}
                              color={"black"}
                            />
                          </View>
                        </IconButton>
                      </PostInteractionButtonContainer>
                    )}
                  </RowContainer>
                </View>
              )}
              keyExtractor={(item, index) => item.post_id.toString()}
            />
          </Container>
        </ScrollView>
      );
    }
  }
}

export default HomeScreen;
