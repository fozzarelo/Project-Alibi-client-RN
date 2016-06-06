import React, { Component } from 'react';
import {StyleSheet, Text, View, AsyncStorage, TextInput, Image, Animated} from 'react-native';
import genStyles from '../common/styles';
import Button from '../common/button';
import DropDown from '../common/dropDown';

export default class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      picTemp: undefined,
      targetEmail: '',
      textEmail:'',
      valuesForPicker: {},
      position: '',
      errorMessage: '',
      fade: new Animated.Value(1), // init opacity
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('username')
      .then(username => {this.setState({username: username});
      });
    AsyncStorage.getItem('email')
      .then(email => {this.setState({email: email});
      });
    AsyncStorage.getItem('contacts')
      .then(contacts => {
        this.setState({valuesForPicker: JSON.parse(contacts)})
      });
    // TODO: need to make sure that this get executed when a pic is taken and we pop the pic view
    // TODO also, we still havent found a way to display the view.. maby we don't need to, we'll just focus on sending it.
    // AsyncStorage.getItem('picTemp')
    //   .then( pic => {
    //     if(pic) {
    //       // console.log("picTemp--------------", pic);
    //       this.setState({picTemp: pic});
    //     }
    //   });
    this.getLocation.bind(this)();
  }


  getLocation(args, callback){
    navigator.geolocation.getCurrentPosition(
      (position) => {
      //  console.log("position b4 stringify---->", position)
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var position = JSON.stringify(position);
        // console.log("var position after stringify---->", latitude)
        // this.setState({position: `${latitude} ${longitude}`});
        var coords = `${latitude} ${longitude}`
        this.translateCoords.bind(this)(coords);
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  translateCoords(coords){
    let url = `http://192.168.0.15:3000/api/v1/addresses/translateCoords?token=12&coords=${coords}`;
    // console.log("HERE GOES NOTHING!!!!", url);
    let request = new Request(url, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'text/plain'})
    });
    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((address) => {
        if (address.error) {
          this.setState({errorMessage: address.error});
          Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
        }
        else {
          // this.setState({errorMessage: '', fade: 1})
          // console.log("got an address!")
          // console.log('--------------->>>', address.streetAddress);
          // Store in state.postition
          this.setState({position: address.streetAddress})
          // console.log('state.position', this.state.position)
        }
      })
      .catch(() => {
      //  console.log('----------------fetch failed--------------');
        this.setState({errorMessage: 'Connection error'});
        Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
      })
  // console.log("location-------------->", latitude, longitude )
  }

  sendBP() {
    var address = this.state.position
    var targetEmail = this.state.targetEmail
    var userEmail = this.state.email

    let url = `http://192.168.0.15:3000/api/v1/messages/sendMessage?token=12&address=${address}&targetEmail=${targetEmail}&userEmail=${userEmail}`;
    console.log("HERE GOES NOTHING!!!!", url);
    let request = new Request(url, {
      method: 'POST',
      headers: new Headers({'Content-Type': 'text/plain'})
    });
    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((message) => {
        if (message.error) {
          this.setState({errorMessage: message.error});
          Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
        }
        else {
          console.log("message is being sent!")
          // console.log('--------------->>>', message.timeStamp);
        }
      })
      .catch(() => {
        console.log('----------------message fetch failed--------------');
        this.setState({errorMessage: 'Connection error'});
        Animated.timing(this.state.fade, {toValue: 0, duration: 2000}).start();
      })
  // console.log("location-------------->", latitude, longitude )
  }

  addPictureBP() {
    // Send message
    console.log('go to picture')
    this.props.navigator.push({name: 'stamps'});
  }

  addUserBP() {
      // Navigate to signup
      this.props.navigator.push({
        name: 'addUser',
        passProps: {isSignUp: false}
      });
  }

  onValueChange(value, key) {
    this.setState({
        textEmail : value
    });
  }

  render() {
    if (!this.state.username) {
      return <Text>Loading...</Text>
    }

    return (
      <View style={genStyles.container}>
        <Text style={genStyles.headerText}>Hi {this.state.username}, checking in?</Text>
        <View>
          <DropDown contacts={this.state.valuesForPicker} onValueChange={this.onValueChange.bind(this)} />
          <TextInput style={genStyles.textInput}
            value={this.state.textEmail}
            onChangeText={(text) => this.setState({textEmail: text})}
            />
          <Text> U-R-@:{this.state.position} </Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Button text={'Add picture'} onPress={this.addPictureBP.bind(this)}/>
          <Button text={'SendBP'} onPress={this.sendBP.bind(this)}/>
        </View>
        <View style={{marginBottom:40, flexDirection:'row'}}>
          <Button text="+" onPress={this.addUserBP.bind(this)}/>
          <Button text="Reload location" onPress={this.getLocation.bind(this)}/>
        </View>
      </View>
    );
  }
}
