import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../styles/globalStyles";
import {
  TakePhotoContainer,
  TakePhotoButtonContainer,
  TakePhotoText,
  TakePhotoButton,
} from "../styles/styles";

class TakePhotoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  }

  postPhoto = async (data) => {
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");
    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
        "X-Authorization": token,
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate("Home");
        } else if (response.status === 400) {
          throw "Bad request";
        } else if (response.status === 401) {
          this.props.navigation.navigate("Login");
        } else if (response.status === 404) {
          throw "Not found";
        } else if (response.status === 500) {
          throw "Server error";
        } else {
          throw "Something went wrong";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.postPhoto(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  render() {
    if (this.state.hasPermission) {
      return (
        <TakePhotoContainer>
          <Camera
            style={GlobalStyles.camera}
            type={this.state.type}
            ref={(ref) => (this.camera = ref)}
          >
            <TakePhotoButtonContainer>
              <TakePhotoButton
                onPress={() => {
                  this.takePicture();
                }}
              >
                <TakePhotoText> Take Photo </TakePhotoText>
              </TakePhotoButton>
            </TakePhotoButtonContainer>
          </Camera>
        </TakePhotoContainer>
      );
    } else {
      return <Text>No access to camera</Text>;
    }
  }
}

export default TakePhotoScreen;
