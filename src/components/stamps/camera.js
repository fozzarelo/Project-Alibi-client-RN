import { Button } from 'react-native-vector-icons/Ionicons';
import { RNS3 } from 'react-native-aws3';
import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Dimensions} from 'react-native';
var Camera = require('react-native-camera');
import genStyles from '../common/styles';



export default class Cam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.front,
      cameraTarget: Camera.constants.CaptureTarget.disk,
      fileName: 'pic' + Date.now() + Math.random() +'.jpg',
    };
  }

  goBack(){
    console.log('going back to the send message view')
    this.props.navigator.pop()
  }

  switchCamera() {
    console.log(this.state.cameraType);
    // console.log(this);
    var front = (this.state.cameraType == Camera.constants.Type.front)
    front ? this.setState({cameraType: Camera.constants.Type.back}) : this.setState({cameraType: Camera.constants.Type.front})
  }

  takePicture() {
    this.camera.capture(this.takePictureResponse.bind(this));
  }

  takePictureResponse(err, data) {
    if(!err) {
      const file = {
        uri: data,
        name: this.state.fileName,
        type: 'image/jpg',
      };

      const options = {
        keyPrefix: '',
        bucket: 'foot-print-pictures',
        region: 'us-west-2',
        accessKey: 'AKIAIR5T4VRUI5S4BH4A',
        secretKey: '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',
        successActionStatus: 201
      };

      RNS3.put(file, options)
        .then(response => {
          if (response.status !== 201) {
            throw new Error('Failed to upload image to S3', response);
          }
          console.log('*** BODY ***', response.body);
          AsyncStorage.setItem('photo', response.body.postResponse.location);
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera ref={(cam) => {this.camera = cam;}}
                captureTarget={this.state.cameraTarget}
                type={this.state.cameraType}
                style={styles.container}
                aspect={Camera.constants.Aspect.fill}
                captureAudio={false}
        />
        <View style={styles.buttonContainer}>
          <Button
            name="ios-phone-portrait"
            size={60}
            backgroundColor="transparent"
            style={{ justifyContent: 'center' }}
            onPress={this.switchCamera.bind(this)}
          />
          <Button
            name="ios-camera-outline"
            size={60}
            backgroundColor="transparent"
            style={{ justifyContent: 'center' }}
            onPress={this.takePicture.bind(this)}
          />
          <Button
            name="ios-checkmark-outline"
            size={60}
            backgroundColor="transparent"
            style={{ justifyContent: 'center' }}
            onPress={this.goBack.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'space-between',
    flexDirection:'row'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  preview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width
  },
  cameraContainer: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
    backgroundColor: 'salmon'
  }
});
