import React, { Component } from 'react';
import {StyleSheet, Text, View, AsyncStorage, Animated, Dimensions} from 'react-native';
import genStyles from '../common/styles';
import DropDown from '../common/dropDown';
import { Button } from 'react-native-vector-icons/Ionicons';

export default class StampsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      messages: [],
      errorMessage: '',
      fade: new Animated.Value(1), // init opacity
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('email')
      .then( mail => {
        this.setState({email: mail})
        console.log("after getting the mail", this.state.email)
        this.getList.bind(this)()
      })
  }

  getList(){
    console.log("----in get list with mail<<-------------", this.state.email)
    this.setState({errorMessage: null});
    this.state.fade.setValue(1);
    let url = `http://192.168.0.15:3000/api/v1/messages/getMessages?token=12&email=${this.state.email}`;
    console.log(url)
    let request = new Request(url, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'text/plain'})
    });

    console.log("----sending request-------------", url)
    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((messages) => {
        if (messages.error) {
          this.setState({errorMessage: messages.error});
          Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
        }
        else {
          console.log("Retrieved messages!", messages)
          this.setState({messages: messages})
        }
      })
      .catch(() => {
        this.setState({errorMessage: 'Connection error'});
        Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      })
  }

  goBackBP(){
    this.props.navigator.pop()
  }

  render (){
    return (
      <View style={genStyles.container}>
        <Text style={{marginTop:150}}>
          Goes for a list of messages....
        </Text>
      <View style={genStyles.footer}>
        <Button name={'md-arrow-round-back'}
                size={60}
                backgroundColor="transparent"
                style={{ justifyContent: 'center' }}
                onPress={this.goBackBP.bind(this)}
        />
      </View>
      </View>
    )
  }
}
