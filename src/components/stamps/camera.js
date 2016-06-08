import { Button } from 'react-native-vector-icons/Ionicons';
import { RNS3 } from 'react-native-aws3';
import React, { Component } from 'react';
import {StyleSheet, Text, View, AsyncStorage} from 'react-native';
import genStyles from '../common/styles';
var Camera = require('react-native-camera');



export default class Cam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.constants.Type.back,
      cameraTarget: Camera.constants.CaptureTarget.disk,
      fileName: 'pic' + Date.now() + Math.random() +'.jpg',
    };
  }

  // TODO when do we reset the camera?
  // componentWillMount() {
  //   AsyncStorage.setItem('photoLink', '')
  // }

  goBack(){
    this.props.navigator.pop()
  }

  switchCamera() {
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
        // accessKey: 'Add your key here',
        // secretKey: 'Add you key here',
        // TODO remember not to commit your aws credentials!
        accessKey: 'AKIAIZDNBWBTII3SNIVQ',
        secretKey: '8ctM1/ofYC6KF+eOf9luEz/41LrZKOFc08GVYGXL',
        successActionStatus: 201
      };

      RNS3.put(file, options)
        .then(response => {
          if (response.status !== 201) {
            throw new Error('Failed to upload image to S3', response);
          }
          console.log('*** BODY ***', response.body);
          AsyncStorage.setItem('photoLink', response.body.postResponse.location);
        });
    }
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
      <View style={styles.container}>
        <View style={styles.buttonContainer}></View>
        <Camera ref={(cam) => {this.camera = cam;}}
                captureTarget={this.state.cameraTarget}
                type={this.state.cameraType}
                style={styles.container}
                aspect={Camera.constants.Aspect.fill}
                captureAudio={false}
        />

        <View style={genStyles.footer}>
          {this._renderButton('ios-phone-portrait', this.switchCamera.bind(this))}
          {this._renderButton('ios-camera-outline', this.takePicture.bind(this))}
          {this._renderButton('ios-checkmark-outline', this.goBack.bind(this))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  }
});
