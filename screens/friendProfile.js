import React, { Component } from "react";
import {
  Button,
  Image,
  View,
  ScrollView,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../styles/globalStyles";
import { Title, Subtitle, BodyText, InputTextBox, ErrorText, InputPostTextBox, PostTextBox, LoadingView } from "../styles/styles";

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
        } else if (response.status === 403) {
          throw "Can only view the posts of yourself or your friends";
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
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          throw "You have already liked this post";
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
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 403) {
          throw "You have not liked this post";
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
    const value = await AsyncStorage.getItem("@session_token");
    if (value == null) {
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    const nav = this.props.navigation;

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
          <Subtitle>Friend Profile</Subtitle>
          
          <View style={GlobalStyles.contentDirection}>
            <Image
              source={{
                uri: this.state.userPhoto,
              }}
              style={GlobalStyles.profilePhoto}
            />
            <BodyText>
              {this.state.firstName} {this.state.lastName} {"\n"}
              {this.state.email} {"\n"}
              Friends: {this.state.friendCount}
            </BodyText>
          </View>

          <Button
            title="Friends"
            onPress={() =>
              nav.navigate("Friends", {
                user_id,
              })
            }
          />

          <InputPostTextBox
            placeholder="Post on your friend's wall!"
            multiline={true}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />

          <Button
            title="Post"
            color="darkblue"
            onPress={() => this.postAddPost()}
          />

          <FlatList
            data={this.state.postData}
            renderItem={({ item }) => (
              <View>
                <PostTextBox>{item.text} </PostTextBox>
                <Button
                  title={"Like"}
                  color="pink"
                  onPress={() => this.likeFriendPost(item.post_id)}
                />
                <Button
                  title={"Remove Like"}
                  color="firebrick"
                  onPress={() => this.removeLikeFromFriendPost(item.post_id)}
                />
                <BodyText>
                  {item.author.first_name} {item.author.last_name}
                  {"\n"}
                  {item.numLikes} Likes{" "}
                </BodyText>
              </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
          />
          <Button
            title="Go back to Friends"
            onPress={() => nav.navigate("Friends")}
          />
        </ScrollView>
      );
    }
  }
}

export default FriendProfileScreen;
