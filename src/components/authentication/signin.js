import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Animated} from 'react-native';
import Button from '../common/button';
import genStyles from '../common/styles';

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      fade: new Animated.Value(1), // init opacity
    };
  }

  handleSignInButtonPress() {
    let url = `http://localhost:3000/api/v1/users/signin?token=12&email=${this.state.email}&password=${this.state.password}`
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
          AsyncStorage.setItem('email', user.email)
           .then(() => {
            this.props.navigator.immediatelyResetRouteStack([{name: 'tweets'}]);
           });
        } else {
          this.setState({errorMessage: 'Wrong credentials, try again?'})
           this.state.fade._value = 1
           Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
        }
      });
  }

  handleSignUpButtonPress() {
    // Navigate to signup
    this.props.navigator.push({name: 'signup'});
  }

  render() {
    return (
      <View style={genStyles.container}>
        <Text>Sign In</Text>
        <Text style={genStyles.label}>Email:</Text>
        <TextInput style={genStyles.textInput}
          value={this.state.email}
          onChangeText={(text) => this.setState({email: text})}
          />
        <Text style={genStyles.label}>Password:</Text>
        <TextInput
          secureTextEntry={true}
          style={genStyles.textInput}
          value={this.state.password}
          onChangeText={(text) => this.setState({password: text})}
          />
        <Animated.Text style={[genStyles.redLabel, {opacity: this.state.fade}]} hidden={!this.state.errorMessage}>{this.state.errorMessage}</Animated.Text>
        <Button text={'Sign In'} onPress={this.handleSignInButtonPress.bind(this)}/>
        <Button text={'Sign Up'} onPress={this.handleSignUpButtonPress.bind(this)}/>
      </View>
    );
  }
}
