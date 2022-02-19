import React, { Component } from 'react';
import { Button, View, StyleSheet, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendProfileScreen extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      postData: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getFriendData();
    this.getFriendPost();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriendData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')
    const { user_id } = this.props.route.params

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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

  getFriendPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')
    const { user_id } = this.props.route.params

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
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

  postLikeFriendPost = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')
    const { user_id } = this.props.route.params

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
          method: 'post',
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
              throw 'You have already liked this post';
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

  deleteLikeFriendPost = async (post_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')
    const { user_id } = this.props.route.params

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
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

    const { user_id } = this.props.route.params

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
          <Text style={{fontSize:18, padding:5, margin:5}}>Friend Profile Placeholder</Text>
          <Text style={{fontSize:16, padding:5, margin:5}}>{this.state.firstName} {this.state.lastName} {"\n"}
          {this.state.email} {"\n"}
          {this.state.friendCount}</Text>
          <FlatList
                data={this.state.postData}
                renderItem={({item}) => (
                    <View>
                      <Text style={styles.postText}>{item.text} </Text> 
                      <Button title={"Like Post"}
                      color="pink"
                      onPress={() => this.postLikeFriendPost(item.post_id)}
                      />
                      <Text style={styles.regularText}>{item.author.first_name} {item.author.last_name}{"\n"}
                      {item.numLikes} Likes </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.post_id.toString()}
          />
          <Button title="Go back to Friends" onPress={() => nav.navigate("Friends")}/>
        </View>
      );
    }
    
  }
}

export default FriendProfileScreen;

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