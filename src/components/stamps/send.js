import React, { Component } from 'react';
import {StyleSheet, Text, View, AsyncStorage, TextInput, Animated, Dimensions} from 'react-native';
import genStyles from '../common/styles';
import DropDown from '../common/dropDown';
import { Button } from 'react-native-vector-icons/Ionicons';

export default class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      photoLink: undefined,
      textEmail:'',
      valuesForPicker: {},
      position: '',
      notification: '',
      lat: '',
      lon: '',
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
    this.getLocation.bind(this)()
    AsyncStorage.setItem('photoLink', '')
  }

  getLocation(args, callback){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        this.setState({lat: latitude, lon: longitude})
        var coords = `${latitude} ${longitude}`
        this.translateCoords.bind(this)(coords);
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000}
    );
  }

  translateCoords(coords){
    let url = `http://172.20.10.3:3000/api/v1/addresses/translateCoords?token=12&coords=${coords}`;
    console.log("Translate coords request:", url);
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
          this.setState({notification: 'translation error'});
          Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
        }
        else {
          console.log('Translated address:', address.streetAddress);
          this.setState({position: address.streetAddress, notification:'reloaded'})
          Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
        }
      })
      .catch(() => {
        console.log('fetch error');
        this.setState({notification: 'fetch error'});
        Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      })
  }

  sendMessage() {
    var address = this.state.position
    var targetEmail = this.state.textEmail
    var userEmail = this.state.email
    var photoLink = this.state.photoLink
    var lat = this.state.lat
    var lon = this.state.lon

    if (!targetEmail) {
      this.setState({notification: 'No email'});
      console.log('-------Failed client side validation--------')
      Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      return
    }
    let url = `http://172.20.10.3:3000/api/v1/messages/sendMessage?token=12&address=${address}&targetEmail=${targetEmail}&userEmail=${userEmail}&photoLink=${photoLink}&lat=${lat}&lon=${lon}`;
    console.log("Sending message request to server-------->>", url);
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
          this.setState({notification: 'message error'});
          Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
        }
        else {
          console.log('message is being sent at:>>>', message.timeSent);
          this.setState({notification: 'Message sent'});
          Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
        }
      })
      .catch(() => {
        console.log('message fetch failed');
        this.setState({notification: 'Connection error'});
        Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
      })
  }

  resetNotification(){
    this.setState({notification: ''});
    this.state.fade.setValue(1);
  }

  sendBP(){
    this.resetNotification.bind(this)()
    AsyncStorage.getItem('photoLink')
      .then( link => {
          console.log("photoLink--------------", link);
          this.setState({photoLink: link});
          this.sendMessage.bind(this)()
      })
  }

  addPictureBP() {
    // Send message
    console.log('go to picture')
    this.props.navigator.push({name: 'cam'});
  }

  getLocationBP(){
    this.resetNotification.bind(this)()
    this.getLocation.bind(this)()
  }

  addUserBP() {
      // Navigate to addUser
      this.props.navigator.push({
        name: 'addUser',
        passProps: {isSignUp: false}
      });
  }

  messagesListBP(){
    this.props.navigator.push({name: 'stampsList'})
  }

  onValueChange(value, key) {
    this.setState({
        textEmail : value
    });
  }

  _renderIcon(iconName, size, action){
    return(
      <Button name={iconName}
              size={size}
              backgroundColor="transparent"
              style={{ justifyContent: 'center' }}
              onPress={action}
      />
    )
  }
  // onPress={this.addUserBP.bind(this)}

  render() {
    if (!this.state.username) {
      return <Text>Loading...</Text>
    }

    return (
      <View style={genStyles.container}>
        <View style={{marginTop:20}}>
          <DropDown contacts={this.state.valuesForPicker}
                    onValueChange={this.onValueChange.bind(this)}
          />
          <View style={{flexDirection:'row'}}>
            <TextInput  autoCapitalize='none'
                        style={genStyles.textInput}
                        value={this.state.textEmail}
                        onChangeText={(text) => this.setState({textEmail: text})}
            />
            {this._renderIcon("md-person-add", 45, this.addUserBP.bind(this))}
          </View>
        </View>
        <View style={styles.rowView}>
          <View style={styles.textContainer}>
            <Text style={{textAlign:'center', alignSelf:'flex-end'}}> {this.state.position} </Text>
          </View>
          {this._renderIcon("md-refresh", 45, this.getLocationBP.bind(this))}
        </View>
        <View style={{height:90, justifyContent:'center'}}>
          <Animated.Text style={[genStyles.notification ,{opacity: this.state.fade}]}>{this.state.notification}</Animated.Text>
        </View>
        <View style={genStyles.footer}>
          {this._renderIcon("ios-albums-outline", 60, this.messagesListBP.bind(this))}
          {this._renderIcon("ios-camera-outline", 60, this.addPictureBP.bind(this))}
          {this._renderIcon("ios-paw-outline", 60, this.sendBP.bind(this))}
        </View>
      </View>
    );
  }
}

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  rowView: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:20
  },
  textContainer: {
    flexDirection:'column',
    height: 60,
    width:220,
    justifyContent:'center'
  },
});
