import React, { Component } from "react";
import {
  Button,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import GlobalStyles from "../styles/globalStyles";
import { Title, Subtitle, BodyText, InputTextBox, ErrorText, PostTextBox, LoadingView } from "../styles/styles";

class HomeScreen extends Component {
  constructor(props) {
    super(props);

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

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.checkLoggedIn();
      this.getUserData();
      this.getUserProfilePhoto();
      this.getPostData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getUserData = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
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
          throw "Unauthorised";
        } else if (response.status === 404) {
          throw "Not found";
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
    const id = await AsyncStorage.getItem("user_id");

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: "get",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.blob();
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorised";
        } else if (response.status === 404) {
          throw "Not found";
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
      })
      .then((responseBlob) => {
        let data = URL.createObjectURL(responseBlob);
        this.setState({
          userPhoto: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addPost = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    let to_send = {
      text: this.state.text,
    };

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
      method: "post",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        if (response.status === 201) {
          this.getPostData();
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorised";
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

  getPostData = async () => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
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
          throw "Unauthorised";
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

  removePost = async (post_id) => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id,
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
          this.getPostData();
          return response.json();
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
          throw "Unauthorised";
        } else if (response.status === 403) {
          throw "You can only delete your own posts";
        } else if (response.status === 404) {
          throw "Not found";
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
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

    if (this.state.isLoading) {
      return (
        <LoadingView>
          <BodyText>Loading..</BodyText>
        </LoadingView>
      );
    } else {
      return (
        <ScrollView>
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

          <Button title="Friends" onPress={() => nav.navigate("Friends")} />

          <Button
            title="Take Photo"
            onPress={() => this.props.navigation.navigate("Take Photo")}
          />

          <Button
            title="Edit Profile"
            onPress={() => this.props.navigation.navigate("Edit Profile")}
          />

          <Button
            title="Logout"
            color="darkblue"
            onPress={() => this.props.navigation.navigate("Logout")}
          />

          <TextInput
            style={GlobalStyles.postTextInput}
            placeholder="What's on your mind today?"
            multiline={true}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />

          <Button
            title="Post"
            color="darkblue"
            onPress={() => this.addPost()}
          />

          <FlatList
            data={this.state.postData}
            renderItem={({ item }) => (
              <View>
                <PostTextBox>{item.text} </PostTextBox>

                <View style={GlobalStyles.contentDirection}>

                  <BodyText>
                    {item.author.first_name} {item.author.last_name}
                    {"\n"}
                    {item.numLikes} Likes{" "}
                  </BodyText>

                  <TouchableOpacity
                    style={GlobalStyles.button}
                    onPress={() => this.removePost(item.post_id)}
                  >
                    <View>
                      <Ionicons 
                        name={"trash-bin"}
                        size={buttonSize}
                        color={"black"}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={GlobalStyles.button}
                    onPress={() =>
                      nav.navigate("Edit Post", { post_id: item.post_id })
                    }
                  >
                    <View>
                      <Ionicons
                        name={"create-outline"}
                        size={buttonSize}
                        color={"black"}
                      />
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
          />
        </ScrollView>
      );
    }
  }
}

export default HomeScreen;
