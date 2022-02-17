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

      origFirstName: '',
      origLastName: '',
      origEmail: '',
      origPassword: '',

      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getUserData();
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
        origUserData: responseJson,
        userId: responseJson.user_id,
        origFirstName: responseJson.first_name,
        origLastName: responseJson.last_name,
        origEmail: responseJson.email,
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  updateUserData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id')

    let to_send = {};

    if (this.state.firstName != this.state.origFirstName){
      to_send['first_name'] = this.state.firstName;
    }

    if (this.state.lastName != this.state.origLastName){
      to_send['last_name'] = this.state.lastName;
    }

    if (this.state.email != this.state.origFirstName){
      to_send['email'] = this.state.email;
    }

    if (this.state.password != this.state.origPassword){
      to_send['password'] = this.state.password;
    }

    return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
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
          <Text style={{fontSize:18, padding:5, margin:5}}>Edit Profile Placeholder</Text>
          
          <Text style={styles.regularText}>First Name</Text>
          <TextInput style={styles.regularText}
            placeholder={this.state.origFirstName}
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}
          />

          <Text style={styles.regularText}>Last Name</Text>
          <TextInput style={styles.regularText}
            placeholder={this.state.origLastName}
            onChangeText={(lastName) => this.setState({lastName})}
            value={this.state.lastName}
          />

          <Text style={styles.regularText}>Email</Text>
          <TextInput style={styles.regularText}
            placeholder={this.state.origEmail}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />

          <Text style={styles.regularText}>Password</Text>
          <TextInput style={styles.regularText}
            placeholder={'New Password'}
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />

          <Button
            title="Update"
            onPress={() => this.updateUserData()}
          />

          <Button
            title="Return to Settings"
            onPress={() => this.props.navigation.navigate("Settings")}
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
    margin:5
  },
});