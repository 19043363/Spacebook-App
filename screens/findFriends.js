// Importing react native components
import React, { Component } from "react";
import { ScrollView, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing styles
import {
  BodyText,
  Box,
  Button,
  ButtonContainer,
  ButtonText,
  Container,
  EndPageRowContainer,
  InputTextBox,
  LoadingView,
  RowContainer,
  SearchButton,
  Subtitle,
} from "../styles/styles";

class FindFriendsScreen extends Component {
  constructor(props) {
    super(props);

    // Set default states for friend data and search query parameters
    this.state = {
      isLoading: true,
      friendData: [],
      friendSearch: "",
      pageLimit: 5,
      offset: 0,
      searchResultsLeft: 0,
    };
  }

  // Check if user is logged in and is called after the page is rendered and find friends
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getFriendsSearch();
    });
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Get list of users for user to add function
  getFriendsSearch = async () => {
    // Gets auth token from async storage
    const token = await AsyncStorage.getItem("@session_token");

    // Get list of users by name search with page limit and varying offset from API server
    return fetch(
      "http://localhost:3333/api/1.0.0/search?q=" +
        this.state.friendSearch +
        "&limit=" +
        this.state.pageLimit +
        "&offset=" +
        this.state.offset,
      {
        method: "get",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        // Status 200 successfully got list of users to add
        if (response.status === 200) {
          return response.json();

          // Status 400 throws bad request
        } else if (response.status === 400) {
          throw "Bad request";

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
        // Set states for user's friend data and number of results left and loading 
        this.setState({
          isLoading: false,
          friendData: responseJson,
          searchResultsLeft: responseJson.length,
        });
      })

      // Displays what error occured in the console
      .catch((error) => {
        console.log(error);
      });
  };

  // Adding friend function
  addFriend = async (user_id) => {
    // Gets auth token from async storage
    const token = await AsyncStorage.getItem("@session_token");

    // Posting request to send a friend request to API server
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", {
        method: "post",
        headers: {
          "X-Authorization": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Status 200 successfully sent a friend request
          if (response.status === 200) {
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");
            throw "Unauthorized";

            // Status 403 throws user is already added as a friend
          } else if (response.status === 403) {
            throw "User is already added as a friend";

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

  // Get the next search page function
  getNextSearchPage() {
    // Initialise offset and page limit variables as state values
    let offset = this.state.offset;
    let pageLimit = this.state.pageLimit;

    // If remaining search results left is more or equal to page limit
    if (this.state.searchResultsLeft >= this.state.pageLimit) {
      // Set new offset to offset plus page limit
      this.setState({
        offset: offset + pageLimit,
      });
    }
    // Call get friend search function to get the next page
    this.getFriendsSearch();
  }

  // Get the previous search page function
  getPreviousSearchPage() {
    // Initialise offset and page limit variables as state values
    let offset = this.state.offset;
    let pageLimit = this.state.pageLimit;

    // If offset is not 0
    if (offset != 0) {
      // New offset is offset minus page limit
      this.setState({
        offset: offset - pageLimit,
      });
    }

    // Call get friend search function to get the previous page
    this.getFriendsSearch();
  }

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
            <Subtitle>Find Friends</Subtitle>

            {/* Input text box for name search and set state to name searching for */}
            <InputTextBox
              placeholder="Search for Friends"
              onChangeText={(friendSearch) => this.setState({ friendSearch })}
              value={this.state.friendSearch}
            />

            {/* Button to search for friend with new query */}
            <ButtonContainer>
              <SearchButton onPress={() => this.getFriendsSearch()}>
                <ButtonText> Search </ButtonText>
              </SearchButton>
            </ButtonContainer>

            {/* Button to navigate to friend requests page */}
            <ButtonContainer>
              <Button onPress={() => nav.navigate("Friend Requests")}>
                <ButtonText> Friend Requests </ButtonText>
              </Button>
            </ButtonContainer>

            {/* Flat list to display the list of users to add */}
            <FlatList
              data={this.state.friendData}
              renderItem={({ item }) => (
                // Box, button container and row container for layout design
                <Box>
                  <ButtonContainer>
                    <RowContainer>
                      {/* Display each user's first name and surname */}
                      <BodyText>
                        {item.user_givenname + " " + item.user_familyname}
                      </BodyText>

                      {/* Button to add user */}
                      <Button onPress={() => this.addFriend(item.user_id)}>
                        <ButtonText>Add</ButtonText>
                      </Button>
                    </RowContainer>
                  </ButtonContainer>
                </Box>
              )}
              keyExtractor={(item, index) => item.user_id.toString()}
            />

            {/* Previous page button */}
            <EndPageRowContainer>
              <ButtonContainer>
                <Button onPress={() => this.getPreviousSearchPage()}>
                  <ButtonText> Back </ButtonText>
                </Button>
              </ButtonContainer>

              {/* Next page button */}
              <ButtonContainer>
                <Button onPress={() => this.getNextSearchPage()}>
                  <ButtonText> Next </ButtonText>
                </Button>
              </ButtonContainer>
            </EndPageRowContainer>
          </Container>
        </ScrollView>
      );
    }
  }
}

export default FindFriendsScreen;
