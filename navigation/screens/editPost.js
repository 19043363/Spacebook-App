import React, {Component} from 'react';
import { Button, View, StyleSheet, Text, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

class EditProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      origUserData: [],
      userId: '',

      origText: '',
      text: ''
    }
  }

  componentDidMount() {

    const { post_id } = this.props.route.params

    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getPodyData(post_id);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getPostData = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
      method: 'get',
      headers: {
        'X-Authorization':  token,
        'Content-Type': 'application/json'
        }
    })
    .then((response) => {
    if(response.status === 200){
      return response.json()
    }else if(response.status === 401){
      this.props.navigation.navigate("Login");
    }else{
      throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        origText: responseJson.text,
        text: responseJson.text
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  patchUpdatePost = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')

    let to_send = {};

    if (this.state.text != this.state.origText){
      to_send['text'] = this.state.text;
    }


    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
      method: 'PATCH',
      headers: {
        'X-Authorization':  token,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
    })
    .then((response) => {
      console.log("Item updated");
    })
    .catch((error) => {
      console.log(error);
    })
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {

    const { post_id } = this.props.route.params

    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
        <View>
          <Text style={{fontSize:18, padding:5, margin:5}}>Edit Post Placeholder</Text>
          <TextInput style={styles.postTextInput}
            placeholder={"Edit your Post"}
            multiline={true}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />

          <Button
            title="Update"
            onPress={() => this.patchUpdatePost(post_id)}
          />

          <Button
            title="Return to Home"
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </View>
      );
    }
    
  }
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  regularText: {
    fontSize:16, 
    padding:5, 
    margin:5,
  },

  postTextInput: {
    fontSize:16, 
    padding:5, 
    margin:5,
    height: 60
  },

  postText: {
    fontSize:16, 
    padding:5, 
    margin:5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2
  },
});