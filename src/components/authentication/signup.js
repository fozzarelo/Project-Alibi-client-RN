import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Animated} from 'react-native';
import Button from '../common/button';
import genStyles from '../common/styles';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordConfirmation: '',
      errorMessage: '',
      fade: new Animated.Value(1), // init opacity
    };
  }

  handleSignInPress() {
    this.props.navigator.pop()
  }

  handleSignUpPress() {
    this.setState({errorMessage: ''});
    this.state.fade._value = 1
    if (!this.state.username || !this.state.password || this.state.password !== this.state.passwordConfirmation) {
      this.setState({errorMessage: 'Password mismatch'});
      Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
      return this.state.errorMessage;
    }

    let url = `http://localhost:3000/api/v1/users/signup?token=12345&username=${this.state.username}&password=${this.state.password}`
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
      .then((json) => {
        if (json.error) {
          this.setState({errorMessage: json.error});
          Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
        } else {
          console.log(json);
          // Store the logged in username
          AsyncStorage.setItem('username', json.username)
            .then(() => {
              // Reset our navigator route stack because we're no longer in the authentication flow
              this.props.navigator.immediatelyResetRouteStack([{name: 'tweets'}]);
            });
        }
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      })
  }

  render() {
    return (
      <View style={genStyles.container}>
        <Text>Sign Up</Text>
        <Text style={genStyles.label}>Username:</Text>
        <TextInput
          value={this.state.username}
          onChangeText={(text) => this.setState({username: text})}
          style={genStyles.textInput} />
        <Text style={genStyles.label}>Password:</Text>
        <TextInput
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
          style={genStyles.textInput} />
        <Text style={genStyles.label}>Confirm Password:</Text>
        <TextInput
          value={this.state.passwordConfirmation}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({passwordConfirmation: text})}
          style={genStyles.textInput} />
        <Animated.Text style={[genStyles.redLabel, {opacity: this.state.fade}]}>
          {this.state.errorMessage}
        </Animated.Text>
        <Button text={'Signup'} onPress={this.handleSignUpPress.bind(this)} />
        <Button text={'Back'} onPress={this.handleSignInPress.bind(this)} />
      </View>
    );
  }
}
