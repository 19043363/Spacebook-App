import React, { Component } from "react";
import { ScrollView, View, Text, TextInput, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Title,
  Subtitle,
  BodyText,
  InputTextBox,
  ErrorText,
  InputPostTextBox,
  LoadingView,
  Button,
  ButtonContainer,
  ButtonText,
  RowContainer,
  EndPageRowContainer,
  SearchButton,
} from "../styles/styles";

class FindFriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendData: [],
      friendSearch: "",
      pageLimit: 5,
      offset: 0,
      searchResultsLeft: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getFriendsSearch();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriendsSearch = async () => {
    const token = await AsyncStorage.getItem("@session_token");

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
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendData: responseJson,
          searchResultsLeft: responseJson.length,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  postAddFriend = async (user_id) => {
    const token = await AsyncStorage.getItem("@session_token");

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + user_id + "/friends",
      {
        method: "post",
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
          throw "User is already added as a friend";
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getNextSearchPage() {
    let offset = this.state.offset;
    let pageLimit = this.state.pageLimit;

    if (this.state.searchResultsLeft >= this.state.pageLimit) {
      this.setState({
        offset: offset + pageLimit,
      });
    }

    this.getFriendsSearch();
  }

  getPreviousSearchPage() {
    let offset = this.state.offset;
    let pageLimit = this.state.pageLimit;

    if (offset != 0) {
      this.setState({
        offset: offset - pageLimit,
      });
    }

    this.getFriendsSearch();
  }

  checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    if (token == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    const nav = this.props.navigation;

    if (this.state.isLoading) {
      return (
        <LoadingView>
          <BodyText>Loading..</BodyText>
        </LoadingView>
      );
    } else {
      return (
        <ScrollView>
          <Subtitle>Find Friends Placeholder</Subtitle>

          <InputTextBox
            placeholder="Search for Friends"
            onChangeText={(friendSearch) => this.setState({ friendSearch })}
            value={this.state.friendSearch}
          />

          <ButtonContainer>
            <SearchButton onPress={() => this.getFriendsSearch()}>
              <ButtonText> Search </ButtonText>
            </SearchButton>
          </ButtonContainer>


          <ButtonContainer>
            <Button onPress={() => nav.navigate("Friend Requests")}>
              <ButtonText> Friend Requests </ButtonText>
            </Button>
          </ButtonContainer>

          <FlatList
            data={this.state.friendData}
            renderItem={({ item }) => (
              <View>
                <ButtonContainer>
                  <Button onPress={() => this.postAddFriend(item.user_id)}>
                    <ButtonText>
                      {" "}
                      {item.user_givenname +
                        " " +
                        item.user_familyname +
                        " +"}{" "}
                    </ButtonText>
                  </Button>
                </ButtonContainer>
              </View>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          />

          <EndPageRowContainer>
            <ButtonContainer>
              <Button onPress={() => this.getPreviousSearchPage()}>
                <ButtonText> Back </ButtonText>
              </Button>
            </ButtonContainer>

            <ButtonContainer>
              <Button onPress={() => this.getNextSearchPage()}>
                <ButtonText> Next </ButtonText>
              </Button>
            </ButtonContainer>
          </EndPageRowContainer>
        </ScrollView>
      );
    }
  }
}

export default FindFriendsScreen;
