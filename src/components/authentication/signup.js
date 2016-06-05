import React, { Component, PropTypes } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Animated} from 'react-native';
import Button from '../common/button';
import genStyles from '../common/styles';

const uri = "http://192.168.0.15:3000/api/v1/users";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.props.isSignUp = props.isSignUp;

    this.state = {
      username: '',
      password: '',
      passwordConfirmation: '',
      email: '',
      errorMessage: '',
      fade: new Animated.Value(1) // init opacity
    };
  }

  static propTypes = {
    isSignUp : React.PropTypes.bool
  }

  static defaultProps = {
    isSignUp : false
  }

  handleSignInPress() {
    this.props.navigator.pop()
  }

  handleSignUpPress() {
    this.setState({errorMessage: ''});
    const username = this.state.username;
    const password = this.state.password;
    const inputEmail = this.state.email;

    this.state.fade._value = 1

    if(this.props.isSignUp) {
      if (!this.state.username || !this.state.password || this.state.password !== this.state.passwordConfirmation) {
        this.setState({errorMessage: 'Try again..'});
        Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
        return this.state.errorMessage;
      }
    }
    console.log("@@@@@@@@@@@@@@@@@@@",username, password, inputEmail)
    if (this.props.isSignUp) {
      let url = `${uri}/signup?token=12&username=${username}&password=${password}&email=${inputEmail}`;
      this.request(url);
    } else {
      AsyncStorage.getItem('email')
        .then(userEmail => {
          let url = `${uri}/addContact?token=12&contactNickname=${username}&contactEmail=${inputEmail}&userEmail=${userEmail}`;
          console.log(url)
          this.request(url);
          //function
        });
    }
  }

  request(url) {
    let request = new Request(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'text/plain'
      }),
    });

    fetch(request)
      .then((response) => {
        console.log("response ===========", response._bodyInit);
        return response.json();
      })
      .then((user) => {

        console.log("user +++++++++++++", user)

        if (user.error.length > 0) {
          this.setState({errorMessage: user.error});
          Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
        } else {
          console.log("user =========",user)
          // Store in devise
          AsyncStorage.setItem('email', user.email)
          AsyncStorage.setItem('username', user.username)
          AsyncStorage.setItem('contacts', JSON.stringify(user.contacts))
            .then(() => {
              // Reset our navigator route stack because we're no longer in the authentication flow
              this.props.navigator.immediatelyResetRouteStack([{name: 'send'}]);
            })
        }
      })
      .catch((error) => {
        this.setState({errorMessage: error});
      })

  }

  renderTitle(){
    let title = this.props.isSignUp ? "Sign Up" : "New contact";
    return <Text style={genStyles.headerText}>{title}</Text>;
  }

  renderName(){
    let label = this.props.isSignUp ? "Username" : "Nickname";
    return <Text style={genStyles.label}>{label}</Text>;
  }

  renderPassword() {
    if(this.props.isSignUp) {
      return (
        <View style={genStyles.container}>
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
        </View>);
    }
  }

  renderActionButton() {
    let label = this.props.isSignUp ? "Sign Up" : "Add";
    return <Button text={label} onPress={this.handleSignUpPress.bind(this)} />
  }



  render() {
    return (
      <View style={genStyles.container}>
        {this.renderTitle.bind(this)()}
        {this.renderName.bind(this)()}
        <TextInput
          value={this.state.username}
          onChangeText={(text) => this.setState({username: text})}
          style={genStyles.textInput} />
        <Text style={genStyles.label}>Email:</Text>
        <TextInput
          value={this.state.email}
          onChangeText={(text) => this.setState({email: text})}
          style={genStyles.textInput} />
        {this.renderPassword.bind(this)()}
        <Animated.Text style={[genStyles.redLabel, {opacity: this.state.fade}]}>
          {this.state.errorMessage}
        </Animated.Text>
        {this.renderActionButton.bind(this)()}
        <View style={{marginBottom: 40}}>
          <Button text={'Back'} onPress={this.handleSignInPress.bind(this)} />
        </View>
      </View>
    );
  }
}
