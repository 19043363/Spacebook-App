import React, { Component } from "react";
import {
  Button,
  ScrollView,
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Title, Subtitle, BodyText, InputTextBox, ErrorText, InputPostTextBox, LoadingView } from "../styles/styles";

class FindFriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendData: [],
      friendSearch: "",
      pageLimit: 3,
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

          <Button
            title="Search"
            color="darkblue"
            onPress={() => this.getFriendsSearch()}
          />

          <Button
            title="Friend Requests"
            color="darkblue"
            onPress={() => this.props.navigation.navigate("Friend Requests")}
          />

          <FlatList
            data={this.state.friendData}
            renderItem={({ item }) => (
              <View>
                <Button
                  title={
                    item.user_givenname + " " + item.user_familyname + " +"
                  }
                  onPress={() => this.postAddFriend(item.user_id)}
                />
              </View>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          />

          <Button
            title="Previous Page"
            color="darkblue"
            onPress={() => this.getPreviousSearchPage()}
          />

          <Button
            title="Next Page"
            color="darkblue"
            onPress={() => this.getNextSearchPage()}
          />
        </ScrollView>
      );
    }
  }
}

export default FindFriendsScreen;
