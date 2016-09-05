import React, { Component, PropTypes } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Animated, Dimensions} from 'react-native';
// import Button from './button';
import { Button } from 'react-native-vector-icons/Ionicons';
import genStyles from '../common/styles';
import appData from '../helpers/constants'

export default class AddUser extends Component {
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

  backBP() {
    this.props.navigator.pop()
  }

  signUpUser() {
    // Restart Error and animation
    this.setState({errorMessage: ''});
    this.state.fade.setValue(1);
    // Values for the url
    const username = this.state.username;
    const password = this.state.password;
    const inputEmail = this.state.email;

    if (!this.state.username || !this.state.password || this.state.password !== this.state.passwordConfirmation) {
      this.setState({errorMessage: 'Try again..'});
      Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      return this.state.errorMessage;
    }
    let url = `${appData.urlBase}/users/signup?token=${appData.urlToken}&username=${username}&password=${password}&email=${inputEmail}`;
    console.log("url here -- - - - - - - ->", url)
    this.request(url);
  }

  addContact(){
    // Restart Error and animation
    this.setState({errorMessage: ''});
    this.state.fade.setValue(1);
    // Values for the url
    const nickname = this.state.username;
    const inputEmail = this.state.email;

    if (!this.state.username || !this.state.email) {
      this.setState({errorMessage: 'Try again..'});
      Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      return this.state.errorMessage;
    }
    AsyncStorage.getItem('email')
      .then(userEmail => {
        let url = `${appData.urlBase}/users/addContact?token=${appData.urlToken}&contactNickname=${nickname}&contactEmail=${inputEmail}&userEmail=${userEmail}`;
        console.log(url)
        this.request(url);
      });
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
        //console.log("response ===========", response._bodyInit);
        return response.json();
      })
      .then((user) => {
        console.log("user =========",user)
        if (user.error.length > 0) {
          this.setState({errorMessage: user.error});
          Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
        } else {
          // Store in devise
          if (this.props.isSignUp){
            AsyncStorage.setItem('email', user.email)
            AsyncStorage.setItem('username', user.username)
          }
          AsyncStorage.setItem('contacts', JSON.stringify(user.contacts))
            .then(() => {
              // Reset our navigator route stack because we're no longer in the authentication flow
              this.props.navigator.immediatelyResetRouteStack([{name: 'send'}]);
            })
        }
      })
      .catch((error) => {
        this.setState({errorMessage: "Connection error"});
        Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      })
  }

  _renderTitle(){
    let title = this.props.isSignUp ? "Sign Up" : "New contact";
    return <Text style={genStyles.headerText}>{title}</Text>
  }

  _renderUserInfo(){
    let label = this.props.isSignUp ? "Username:" : "Nickname:"
    let spacing = this.props.isSignUp ? 0 : 40
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={genStyles.label}>{label}</Text>
        <TextInput  value={this.state.username}
                    onChangeText={(text) => this.setState({username: text})}
                    style={styles.textInput}
        />
        <View style={{height:spacing}}></View>
        <Text style={genStyles.label}>Email:</Text>
        <TextInput  autoCapitalize='none'
                    value={this.state.email}
                    onChangeText={(text) => this.setState({email: text})}
                    style={styles.textInput}
        />
      </View>
    )
  }

  _renderPassword() {
    if(this.props.isSignUp) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text style={genStyles.label}>
            Password:
          </Text>
          <TextInput  value={this.state.password}
                      secureTextEntry={true}
                      onChangeText={(text) => this.setState({password: text})}
                      style={styles.textInput}
          />
          <Text style={genStyles.label}>
            Confirm Password:
          </Text>
          <TextInput  value={this.state.passwordConfirmation}
                      secureTextEntry={true}
                      onChangeText={(text) => this.setState({passwordConfirmation: text})}
                      style={styles.textInput}
          />
        </View>
      )
    }
  }

  _renderActionButton(){
    let action = this.props.isSignUp ? this.signUpUser.bind(this) : this.addContact.bind(this)
    let iconName = this.props.isSignUp ? 'md-log-in' : 'md-person-add'
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
        {this._renderTitle.bind(this)()}
        {this._renderUserInfo.bind(this)()}
        {this._renderPassword.bind(this)()}
        <View style={{height:40}}>
          <Animated.Text style={[genStyles.notification, {opacity: this.state.fade}]}>
            {this.state.errorMessage}
          </Animated.Text>
        </View>
        <View style={genStyles.footer}>
          <Button name={"md-arrow-round-back"}
                  size={60}rrr
                  backgroundColor="transparent"
                  style={{ justifyContent: 'center' }}
                  onPress={this.backBP.bind(this)}
          />
          {this._renderActionButton.bind(this)()}
        </View>
      </View>
    )
  }
}

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'transparent',
    color: 'grey',
    padding: 4,
    height: 35,
    borderColor: '#05A5D1',
    borderWidth: 1,
    borderRadius: 5,
    margin: 1,
    width: 220,
    alignSelf: 'center'
  },
});
