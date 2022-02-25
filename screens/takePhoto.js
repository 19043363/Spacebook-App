import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../styles/globalStyles";

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
        console.log("Picture added", response);
        this.props.navigation.navigate("Home");
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
        <View style={GlobalStyles.takePhotoContainer}>
          <Camera
            style={GlobalStyles.camera}
            type={this.state.type}
            ref={(ref) => (this.camera = ref)}
          >
            <View style={GlobalStyles.takePhotoButtonContainer}>
              <TouchableOpacity
                style={GlobalStyles.takePhotoButton}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={GlobalStyles.takePhotoText}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    } else {
      return <Text>No access to camera</Text>;
    }
  }
}

export default TakePhotoScreen;
