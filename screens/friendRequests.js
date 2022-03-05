import React, { Component } from "react";
import { ScrollView, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

    this.state = {
      isLoading: true,
      friendRequestData: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });

    this.getFriendRequests();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriendRequests = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      method: "get",
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendRequestData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptFriendRequest = async (user_id) => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
      method: "post",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequests();
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
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

  rejectFriendRequest = async (user_id) => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
      method: "delete",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequests();
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
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
          <Container>
            <Subtitle>Friends Requests</Subtitle>
            <FlatList
              data={this.state.friendRequestData}
              renderItem={({ item }) => (
                <Box>
                  <BodyText>{item.first_name + " " + item.last_name}</BodyText>

                  <ButtonContainer>
                    <AcceptButton
                      onPress={() => this.acceptFriendRequest(item.user_id)}
                    >
                      <ButtonText> Accept </ButtonText>
                    </AcceptButton>
                  </ButtonContainer>

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
