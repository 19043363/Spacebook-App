// Importing react native components
import React, { Component } from "react";
import { ScrollView, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing styles
import {
  AcceptButton,
  BodyText,
  Box,
  ButtonContainer,
  ButtonText,
  Container,
  LoadingView,
  RejectButton,
  Subtitle,
} from "../styles/styles";

class FriendRequestsScreen extends Component {
  constructor(props) {
    super(props);

    // Set state for friend requests data and loading state
    this.state = {
      isLoading: true,
      friendRequestData: [],
    };
  }

  // Check if user is logged in and is called after the page is rendered and get friend requests
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });

    this.getFriendRequests();
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Get list of friend requests function
  getFriendRequests = async () => {
    // Gets auth token from async storage
    const token = await AsyncStorage.getItem("@session_token");

    // Get list of friend requests from the API server
    return (
      fetch("http://localhost:3333/api/1.0.0/friendrequests", {
        method: "get",
        headers: {
          "X-Authorization": token,
        },
      })
        .then((response) => {
          // Status 200 successfully got list of friend requests
          if (response.status === 200) {
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 500 throws server error
          } else if (response.status === 500) {
            throw "Server error";

            // Throws 'something went wrong' for other errors
          } else {
            throw "Something went wrong";
          }
        })
        .then((responseJson) => {
          // Set states friend requests data and loading state
          this.setState({
            isLoading: false,
            friendRequestData: responseJson,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Accept friend request function passes user id parameter of friend to be added
  acceptFriendRequest = async (user_id) => {
    // Gets auth token from async storage
    const token = await AsyncStorage.getItem("@session_token");

    // Post to API server friend request has been accepted from specified user
    return (
      fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
        method: "post",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully added friend and refreshes friend request page
          if (response.status === 200) {
            this.getFriendRequests();
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");

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

  // Reject friend request function passes user id parameter to be rejected
  rejectFriendRequest = async (user_id) => {
    const token = await AsyncStorage.getItem("@session_token");

    // Delete friend request sent to API server
    return (
      fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
        method: "delete",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully deleted friend request and refreshes friend request page
          if (response.status === 200) {
            this.getFriendRequests();
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");

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
          // Set loading screen state to false
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
    const token = await AsyncStorage.getItem("@session_token");

    // If the auth token is empty, navigate to login screen
    if (token == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    // Navigation command efficiency
    const nav = this.props.navigation;

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
            <Subtitle>Friends Requests</Subtitle>

            {/* Flat list to display the list of friend requests */}
            <FlatList
              data={this.state.friendRequestData}
              renderItem={({ item }) => (
                // Box and button container for layout design
                <Box>
                  {/* Display each user's first name and surname */}
                  <BodyText>{item.first_name + " " + item.last_name}</BodyText>

                  {/* Button to accept friend request */}
                  <ButtonContainer>
                    <AcceptButton
                      onPress={() => this.acceptFriendRequest(item.user_id)}
                    >
                      <ButtonText> Accept </ButtonText>
                    </AcceptButton>
                  </ButtonContainer>

                  {/* Button to reject/ delete friend request */}
                  <ButtonContainer>
                    <RejectButton
                      onPress={() => this.rejectFriendRequest(item.user_id)}
                    >
                      <ButtonText> Reject </ButtonText>
                    </RejectButton>
                  </ButtonContainer>
                </Box>
              )}
              keyExtractor={(item, index) => item.user_id.toString()}
            />
          </Container>
        </ScrollView>
      );
    }
  }
}

export default FriendRequestsScreen;
