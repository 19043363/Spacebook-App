import React, { Component } from "react";
import { View, ScrollView, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Title,
  Subtitle,
  BodyText,
  InputTextBox,
  ErrorText,
  InputPostTextBox,
  PostTextBox,
  LoadingView,
  ProfilePhoto,
  ProfileContainer,
  IconButton,
  Button,
  ButtonText,
  ButtonContainer,
  RowContainer,
  PostInteractionButtonContainer,
} from "../styles/styles";

class FriendProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      postData: [],
      userPhoto: "",
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      friendCount: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
    });

    this.getFriendData();
    this.getUserProfilePhoto();
    this.getFriendPostData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriendData = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const { user_id } = this.props.route.params;

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
      method: "get",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
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
          userId: responseJson.user_id,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          email: responseJson.email,
          friendCount: responseJson.friend_count,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUserProfilePhoto = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const { user_id } = this.props.route.params;

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
      method: "get",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          userPhoto: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getFriendPostData = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const { user_id } = this.props.route.params;

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
      method: "get",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
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
          postData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  likeFriendPost = async (post_id) => {
    const token = await AsyncStorage.getItem("@session_token");
    const { user_id } = this.props.route.params;

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" +
        user_id +
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
        if (response.status === 200) {
          this.getFriendPostData();
          return response.json();
        } else if (response.status === 400) {
          throw "You have already liked this post";
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
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
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  removeLikeFromFriendPost = async (post_id) => {
    const token = await AsyncStorage.getItem("@session_token");
    const { user_id } = this.props.route.params;

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" +
        user_id +
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
        if (response.status === 200) {
          this.getFriendPostData();
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorized";
        } else if (response.status === 403) {
          throw "You have not liked this post";
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
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  postAddPost = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const { user_id } = this.props.route.params;

    let to_send = {
      text: this.state.text,
    };

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
      method: "post",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        if (response.status === 201) {
          this.getFriendPostData();
          return response.json();
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
        });
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
    const nav = this.props.navigation;
    const buttonSize = 28;
    const { user_id } = this.props.route.params;

    if (this.state.isLoading) {
      return (
        <LoadingView>
          <BodyText>Loading..</BodyText>
        </LoadingView>
      );
    } else {
      return (
        <ScrollView>
          <ProfileContainer>
            <ProfilePhoto
              source={{
                uri: this.state.userPhoto,
              }}
            />
            <BodyText>
              {this.state.firstName} {this.state.lastName} {"\n"}
              {this.state.email} {"\n"}
              Friends: {this.state.friendCount}
            </BodyText>
          </ProfileContainer>

          <ButtonContainer>
            <Button onPress={() => nav.navigate("Friends", { user_id })}>
              <ButtonText> Friends </ButtonText>
            </Button>
          </ButtonContainer>

          <InputPostTextBox
            placeholder="Post on your friend's wall!"
            multiline={true}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />

          <ButtonContainer>
            <Button onPress={() => this.addPost()}>
              <ButtonText> Post </ButtonText>
            </Button>
          </ButtonContainer>

          <FlatList
            data={this.state.postData}
            renderItem={({ item }) => (
              <View>
                <PostTextBox>{item.text} </PostTextBox>

                <RowContainer>
                  <BodyText>
                    {item.author.first_name} {item.author.last_name}
                    {"\n"}
                    {item.numLikes} Likes{" "}
                  </BodyText>

                  <PostInteractionButtonContainer>
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
                </RowContainer>
              </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
          />

          <ButtonContainer>
            <Button onPress={() => nav.navigate("Friends")}>
              <ButtonText> Go back to Friends </ButtonText>
            </Button>
          </ButtonContainer>

        </ScrollView>
      );
    }
  }
}

export default FriendProfileScreen;
