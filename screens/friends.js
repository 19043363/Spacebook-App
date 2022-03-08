// Importing react native components
import React, { Component } from "react";
import { ScrollView, View, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing styles
import {
  BodyText,
  Button,
  ButtonContainer,
  ButtonText,
  Container,
  EndPageRowContainer,
  InputTextBox,
  LoadingView,
  Subtitle,
} from "../styles/styles";

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    // Set states for friend data, friend id, user's id, search query parameters and loading
    this.state = {
      isLoading: true,
      friendData: [],
      friendId: "",
      user_id: "",
      friendSearch: "",
      pageLimit: 2,
      offset: 0,
      searchResultsLeft: 0,
    };
  }

  // Check if user is logged in and is called after the page is rendered and get friends
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getFriends();
    });
  }

  // Executes code when component unmounts
  componentWillUnmount() {
    this.unsubscribe();
  }

  // Get list of all of the user's friends function
  getFriends = async () => {
    // Gets auth token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    let id = await AsyncStorage.getItem("user_id");

    // Get friend's id from route params
    let user_id = this.props.route.params;

    // If friend's id is not null
    if (user_id != null) {
      // Set user id as friend's id to open up friend's friend list
      this.setState({
        userId: user_id.user_id,
      });
    } else {
      // Set user's id as logged in user's id
      this.setState({
        userId: id,
      });
    }

    // Get all user's friends from API server
    return (
      fetch(
        "http://localhost:3333/api/1.0.0/user/" +
          this.state.userId +
          "/friends",
        {
          method: "get",
          headers: {
            "X-Authorization": token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          // Status 200 successfully got list of friends
          if (response.status === 200) {
            return response.json();

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");

            // Status 403 throws can only view friends of yourself or your friends
          } else if (response.status === 403) {
            throw "Can only view the friends of yourself or your friends";

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
          // Set friend's data and loading screen state to false
          this.setState({
            isLoading: false,
            friendData: responseJson,
          });
        })

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Get list of friends through query search function
  getFriendsSearch = async () => {
    // Gets auth token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");

    // Get list of users by name search with page limit and varying offset
    return fetch(
      "http://localhost:3333/api/1.0.0/search?search_in=friends&q=" +
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
        // Status 200 successfully got list of friends
        if (response.status === 200) {
          return response.json();

          // Status 401 throws unauthorised access and navigate to login page
        } else if (response.status === 401) {
          console.log("Unauthorised");
          this.props.navigation.navigate("Login");

          // Status 403 throws can only view friends of yourself or your friends
        } else if (response.status === 403) {
          throw "Can only view the friends of yourself or your friends";

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
        this.setState({
          // Set states for user's friend data and number of results left
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
            <Subtitle>Friends</Subtitle>

            {/* Input text box for name search and set state to name searching for */}
            <InputTextBox
              placeholder="Search for Friends"
              onChangeText={(friendSearch) => this.setState({ friendSearch })}
              value={this.state.friendSearch}
            />

            {/* Button to search for friend with new query */}
            <ButtonContainer>
              <Button onPress={() => this.getFriendsSearch()}>
                <ButtonText> Search </ButtonText>
              </Button>
            </ButtonContainer>

            {/* Flat list to display the list of friends */}
            <FlatList
              data={this.state.friendData}
              renderItem={({ item }) => (
                <View>
                  <ButtonContainer>
                    {/* Button to navigate to friend's profile */}
                    <Button
                      onPress={() =>
                        nav.navigate("Friend Profile", {
                          user_id: item.user_id,
                        })
                      }
                    >
                      {/* Display each user's first name and surname */}
                      <ButtonText>
                        {item.user_givenname + " " + item.user_familyname}
                      </ButtonText>
                    </Button>
                  </ButtonContainer>
                </View>
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

export default FriendsScreen;
