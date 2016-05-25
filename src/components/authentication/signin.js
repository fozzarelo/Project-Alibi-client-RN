import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage} from 'react-native';
import Button from '../common/button';

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: null
    };
  }

  handleSignInButtonPress() {
    let url = `http://localhost:3000/api/v1/users/signin?token=12345&username=${this.state.username}&password=${this.state.password}`
    let request = new Request(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'text/plain'
      }),
    });
    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((user) => {
        if (user) {
          this.setState({errorMessage: null})
          console.log("Successfully logged in");
          AsyncStorage.setItem('username', user.username)
           .then(() => {
            this.props.navigator.immediatelyResetRouteStack([{name: 'tweets'}]);
           });
        } else {
          this.setState({errorMessage: 'Invalid login parameters'})
        }
      });
  }

  handleSignUpButtonPress() {
    // Navigate to signup
    this.props.navigator.push({name: 'signup'});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign In</Text>
        <Text style={styles.label}>Username:</Text>
        <TextInput style={styles.input}
          value={this.state.username}
          onChangeText={(text) => this.setState({username: text})}
          />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
          onChangeText={(text) => this.setState({password: text})}
          />
        <Text style={styles.label} hidden={!this.state.errorMessage}>{this.state.errorMessage}</Text>
        <Button text={'Sign In'} onPress={this.handleSignInButtonPress.bind(this)}/>
        <Button text={'I need an account...'} onPress={this.handleSignUpButtonPress.bind(this)}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    padding: 4,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    width: 200,
    alignSelf: 'center'
  },
  label: {
    fontSize: 18
  }
});
