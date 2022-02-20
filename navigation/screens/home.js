import React, {Component} from 'react';
import { Button, View, StyleSheet, Text, TextInput, FlatList, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from "@expo/vector-icons";

class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      userData: [],
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      friendCount: '',
      text: '',
      postData: [],
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getUserData();
    this.getShowPost();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getUserData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
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
            userData: responseJson,
            userId: responseJson.user_id,
            firstName: responseJson.first_name,
            lastName: responseJson.last_name,
            email: responseJson.email,
            friendCount: responseJson.friend_count
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  postAddPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')

    let to_send = {
      text: this.state.text
    }

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
          method: 'post',
          headers: {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(to_send)
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
            isLoading: false
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getShowPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
          method: 'get',
          headers: {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
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
            postData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  deleteRemovePost = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
          method: 'delete',
          headers: {
            'X-Authorization':  token,
            'Content-Type': 'application/json'
          },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 403){
              throw 'You can only delete your own posts';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
          })
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
    const nav = this.props.navigation;

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
        <ScrollView>
          <Text style={{fontSize:18, padding:5, margin:5}}>Home</Text>
          <Text style={{fontSize:16, padding:5, margin:5}}>{this.state.firstName} {this.state.lastName} {"\n"}
          {this.state.email} {"\n"}
          {this.state.friendCount}</Text>

          <Button
            title="Logout"
            color="darkblue"
            onPress={() => this.props.navigation.navigate("Logout")}
          />

          <TextInput style={styles.postTextInput}
            placeholder="What's on your mind today?"
            multiline={true}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />

          <Button
            title="Post"
            color="darkblue"
            onPress={() => this.postAddPost()}
          />

          <FlatList
                data={this.state.postData}
                renderItem={({item}) => (
                    <View>
                      <Text style={styles.postText}>{item.text} </Text> 

                      <Button title={"Delete Post"}
                      color="firebrick"
                      onPress={() => this.deleteRemovePost(item.post_id)}/>

                      <Button title={"Update Post"}
                      color="orange"
                      onPress={() => nav.navigate("Edit Post", 
                      {post_id: item.post_id})
                      }
                      />

                      <Text style={styles.regularText}>{item.author.first_name} {item.author.last_name}{"\n"}
                      {item.numLikes} Likes </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.post_id.toString()}
          />

        </ScrollView>
      );
    }    
  }
}



export default HomeScreen;

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