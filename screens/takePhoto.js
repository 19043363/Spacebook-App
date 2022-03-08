// Importing react native components
import React, { Component } from "react";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing styles
import {
  ErrorText,
  LoadingView,
  TakePhotoButton,
  TakePhotoButtonContainer,
  TakePhotoContainer,
  TakePhotoText,
} from "../styles/styles";

class TakePhotoScreen extends Component {
  constructor(props) {
    super(props);

    // Set default states for camera permission and camera type
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  // Check if user is logged in and is called after the page is rendered and permission state
  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === "granted" });
  }

  // Post photo function
  postPhoto = async (data) => {
    // Gets auth token and user id from async storage
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");

    // Set res and blob
    const res = await fetch(data.base64);
    const blob = await res.blob();

    // Post user's profile photo to API server
    return (
      fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
        method: "POST",
        headers: {
          "Content-Type": "image/png",
          "X-Authorization": token,
        },
        body: blob,
      })
        .then((response) => {
          // Status 200 successfully posted profile photo and navigate back home
          if (response.status === 200) {
            this.props.navigation.navigate("Home");

            // Status 400 throws bad request
          } else if (response.status === 400) {
            throw "Bad request";

            // Status 401 throws unauthorised access and navigate to login page
          } else if (response.status === 401) {
            this.props.navigation.navigate("Login");

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

        // Displays what error occured in the console
        .catch((error) => {
          console.log(error);
        })
    );
  };

  // Take picture function
  takePicture = async () => {
    // If camera is true
    if (this.camera) {
      // Set photo to 50% resolution and base 64 format
      const options = {
        quality: 0.5,
        base64: true,

        // Send photo to post photo function
        onPictureSaved: (data) => this.postPhoto(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  render() {
    // Render if permission to camera is true
    if (this.state.hasPermission) {
      return (
        // Take photo container
        <TakePhotoContainer>
          <Camera type={this.state.type} ref={(ref) => (this.camera = ref)}>
            <TakePhotoButtonContainer>
              {/* Button to take photo */}
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

      // Else render no access to camera page
    } else {
      return (
        <LoadingView>
          <ErrorText>No access to camera</ErrorText>
        </LoadingView>
      );
    }
  }
}

export default TakePhotoScreen;
