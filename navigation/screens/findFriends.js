import React, {Component} from 'react';
import { Button, View, Text, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GlobalStyles from '../../styles/globalStyles';

class FindFriendsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      friendData: [],
      friendData: [],
      friendSearch: '', 
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getSearchList();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getSearchList = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id');

    return fetch("http://localhost:3333/api/1.0.0/search", {
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
            friendData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  getUserFriendsSearch = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id');

    return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.friendSearch, {
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
            friendData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  postAddFriend = async (user_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", {
      method: 'post',
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
            }else if(response.status === 403){
              throw 'User is already added as a friend';
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
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {

    if (this.state.isLoading){
      return (
        <View
          style={GlobalStyles.loading}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
        <View>
          <Text style={GlobalStyles.headerText}>Find Friends Placeholder</Text>
          <TextInput style={GlobalStyles.regularText}
            placeholder="Search for Friends"
            onChangeText={(friendSearch) => this.setState({friendSearch})}
            value={this.state.friendSearch}
          />

          <Button
          title="Search"
          color="darkblue"
          onPress={() => this.getUserFriendsSearch()}/>

          <Button
          title="Friend Requests"
          color="darkblue"
          onPress={() => this.props.navigation.navigate("Friend Requests")}/>

          <FlatList
                data={this.state.friendData}
                renderItem={({item}) => (
                    <View>
                      <Button title={item.user_givenname + " " + item.user_familyname + " +"}
                      onPress={() => this.postAddFriend(item.user_id)}/>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
          />
        </View>
      );
    }
  }
}

export default FindFriendsScreen;