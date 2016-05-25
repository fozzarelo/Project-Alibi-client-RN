import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage} from 'react-native';
import Button from '../common/button';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordConfirmation: '',
      errorMessage: '',
    };
  }

  handleSignInPress() {
    this.props.navigator.pop()
  }

  handleSignUpPress() {
    this.setState({errorMessage: ''});
    if (!this.state.username || !this.state.password || this.state.password !== this.state.passwordConfirmation) {
      return;
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

  renderPasswordMatchError() {
    return this.state.password == this.state.passwordConfirmation ? null : (<Text style={styles.label}>Your passwords do not match</Text>)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          value={this.state.username}
          onChangeText={(text) => this.setState({username: text})}
          style={styles.input} />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
          style={styles.input} />
        <Text style={styles.label}>Confirm Password:</Text>
        <TextInput
          value={this.state.passwordConfirmation}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({passwordConfirmation: text})}
          style={styles.input} />

        {this.renderPasswordMatchError()}
        <Text style={styles.label}>{this.state.errorMessage}</Text>
        <Button text={'Signup'} onPress={this.handleSignUpPress.bind(this)} />
        <Button text={'I have an account...'} onPress={this.handleSignInPress.bind(this)} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  label: {
    fontSize: 18
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
  }
});
