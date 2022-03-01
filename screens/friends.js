import React, { Component } from "react";
import { Button, View, Text, TextInput, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../styles/globalStyles";

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      friendData: [],
      friendId: "",
      user_id: "",
      friendSearch: "",
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getFriends();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriends = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    let id = await AsyncStorage.getItem("user_id");
    let user_id = this.props.route.params;

    if (user_id != null) {
      this.setState({
        userId: user_id.user_id,
      });
    } else {
      this.setState({
        userId: id,
      });
    }

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + this.state.userId + "/friends",
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
        } else if (response.status === 403) {
          throw "Can only view the friends of yourself or your friends";
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
          friendData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getFriendsSearch = async () => {
    const token = await AsyncStorage.getItem("@session_token");

    return fetch(
      "http://localhost:3333/api/1.0.0/search?search_in=friends&q=" + this.state.friendSearch,
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
          console.log("Friend search retrieved")
          return response.json();
        } else if (response.status === 401) {
          console.log("Unauthorised");
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          throw "Can only view the friends of yourself or your friends";
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
          friendData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        <View style={GlobalStyles.loading}>
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={GlobalStyles.headerText}>Friends</Text>

          <TextInput
            style={GlobalStyles.regularText}
            placeholder="Search for Friends"
            onChangeText={(friendSearch) => this.setState({ friendSearch })}
            value={this.state.friendSearch}
          />

          <Button
            title="Search"
            color="darkblue"
            onPress={() => this.getFriendsSearch()}
          />

          <FlatList
            data={this.state.friendData}
            renderItem={({ item }) => (
              <View>
                <Button
                  title={item.user_givenname + " " + item.user_familyname}
                  onPress={() =>
                    nav.navigate("Friend Profile", {
                      user_id: item.user_id,
                    })
                  }
                />
              </View>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          />
        </View>
      );
    }
  }
}

export default FriendsScreen;
