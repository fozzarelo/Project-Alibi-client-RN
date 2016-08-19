import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Animated} from 'react-native';
import { Button } from 'react-native-vector-icons/Ionicons';
import Header from '../common/header';
import genStyles from '../common/styles';
import Cons from '../helpers/constants';

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

  SignInBP() {
    this.setState({errorMessage: null});
    this.state.fade.setValue(1);

    let url = `https://alibi-serv.herokuapp.com/api/v1/users/signin?token=tok109tok&email=${this.state.email}&password=${this.state.password}`;
    let request = new Request(url, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'text/plain'})
    });
    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((user) => {
        if (user.error) {
          this.setState({errorMessage: user.error});
          Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
        }
        else {
          console.log("Successfully logged in")
          AsyncStorage.setItem('email', user.email)
          AsyncStorage.setItem('username', user.username)
          AsyncStorage.setItem('contacts', JSON.stringify(user.contacts))
            .then(() => {
              this.props.navigator.immediatelyResetRouteStack([{name: 'send'}]);
            })
        }
      })
      .catch(() => {
        this.setState({errorMessage: 'Connection error'});
        Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      })
  }

  SignUpBP() {
    // Navigate to signup
    this.props.navigator.push({
      name: 'addUser',
      passProps: {
        isSignUp: true
      }
    });
  }

  _renderButton(iconName, action){
    return(
      <Button name={iconName}
              size={60}
              backgroundColor="transparent"
              style={{ justifyContent: 'center' }}
              onPress={action}
      />
    )
  }

  render() {
    return (
      <View style={genStyles.container}>
        <Text style={genStyles.headerText}>Sign In</Text>
        <Text style={genStyles.label}>Email:</Text>
        <TextInput  autoCapitalize='none'
                    style={genStyles.textInput}
                    value={this.state.email}
                    onChangeText={(text) => this.setState({email: text})}
        />
        <Text style={genStyles.label}>Password:</Text>
        <TextInput  secureTextEntry={true}
                    style={genStyles.textInput}
                    value={this.state.password}
                    onChangeText={(text) => this.setState({password: text})}
        />
        <View style={{height:40}}>
          <Animated.Text style={[genStyles.notification, {opacity: this.state.fade}]}>
            {this.state.errorMessage}
          </Animated.Text>
        </View>
        <View style={genStyles.footer}>
          {this._renderButton.bind(this)('md-person', this.SignUpBP.bind(this))}
          {this._renderButton.bind(this)('md-log-in', this.SignInBP.bind(this))}
        </View>
      </View>
    );
  }
}
