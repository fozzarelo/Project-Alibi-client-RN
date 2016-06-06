import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image} from 'react-native';
var Camera = require('react-native-camera');
import genStyles from '../common/styles';

export default class Stamps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      cameraType: Camera.constants.Type.front,
      cameraTarget: Camera.constants.CaptureTarget.disk,
      photo: ''
    };
  }

  switchCamera() {
    // console.log(Camera.constants.Type.front);
    // console.log(this);
    this.setState({cameraType: Camera.constants.Type.back});
  }

  takePicture() {
    this.refs.cam.capture(this.takePictureResponse.bind(this));
  }
  takePictureResponse(err, pictureData) {
      if(!err) {
        this.setState({photo: pictureData});
        // console.log('@@@@@@@@@@@@@@@@@@@@@')
        // console.log(this.state.photo);
        // console.log(this.state.cameraTarget);
        AsyncStorage.setItem('photo', pictureData);
        // this.props.navigator.pop();

      }
  }


  render() {

    return (
      <View>
      <Camera ref="cam" captureTarget={this.state.cameraTarget} style={styles.container} type={this.state.cameraType}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text ref="textito" style={styles.instructions}>
          To get started, edit index.ios.js{'\n'}
          Press Cmd+R to reload
        </Text>
        <TouchableHighlight onPress={this.switchCamera.bind(this)}>
          <Text>The old switcheroo</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.takePicture.bind(this)}>
          <Text style={styles.texto}>Take Picture</Text>
        </TouchableHighlight>
      </Camera>
      <Image style={styles.img} source={{uri: this.state.photo}} />
      </View>

    );
  }
}


var styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  texto: {
    fontSize: 35,
  },
  img: {
    height: 300,
    width: 400,
    borderColor: 'black',
    borderWidth:2
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
});
