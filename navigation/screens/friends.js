import React, {Component} from 'react';
import {Button, View, Text, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack'

class FriendsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getFriends();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getFriends = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id');

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
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
            listData: responseJson
          })
          console.log(this.state.listData)
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
        <View>
          <Text style={{fontSize:18, padding:5, margin:5}}>Friends</Text>
          <Button title="Friend Profile" onPress={() => nav.navigate("Friend Profile")}/>
          <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Button title={item.user_givenname + " " + item.user_familyname}/>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
          />
        </View>
      );
    }
    
  }
}


export default FriendsScreen;
