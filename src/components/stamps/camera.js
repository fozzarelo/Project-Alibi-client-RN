// import React, { Component } from 'react';
// import { CameraRoll, Dimensions, View, StyleSheet } from 'react-native';
// import Camera from 'react-native-camera';
import { Button } from 'react-native-vector-icons/Ionicons';
import { RNS3 } from 'react-native-aws3';
//
//
// export default class CameraApp extends Component {
//   constructor() {
//     super();
//     this.takePicture = this.takePicture.bind(this);
//   }
//
//   takePicture() {
//     console.log('---------here------')
//     // console.log(this)
//     console.log(this.camera)
//     this.camera.capture()
//       .then((data) => {
//
//         const file = {
//           uri: data.path,
//           name: 'photo.jpg',
//           type: 'image/jpeg'
//         };
//
//         const options = {
//           keyPrefix: 'photos/',
//           bucket: 'foot-print-pictures',
//           region: 'eu-west-2',
//           accessKey: 'AKIAIR5T4VRUI5S4BH4A',
//           secretKey: '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',
//           successActionStatus: 201
//         };
//
//         RNS3.put(file, options).then(response => {
//           if (response.status !== 201) {
//             throw new Error('Failed to upload image to S3', response);
//           }
//           console.log('*** BODY ***', response.body);
//         });
//       })
//       .catch(err => console.error(err));
//   }
//
//   render() {
//     return (
//       <View style={styles.container}>
//         <Camera
//           ref={(cam) => {
//             this.camera = cam;
//           }}
//           style={styles.cameraContainer}
//           aspect={Camera.constants.Aspect.fill}
//           captureAudio={false}
//         />
//         <Button
//           name="ios-camera-outline"
//           size={60}
//           backgroundColor="transparent"
//           style={{ justifyContent: 'center' }}
//           onPress={this.takePicture.bind(this)}
//         />
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'black'
//   },
//   preview: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: Dimensions.get('window').width,
//     width: Dimensions.get('window').width
//   },
//   cameraContainer: {
//     height: Dimensions.get('window').width,
//     width: Dimensions.get('window').width,
//     backgroundColor: 'salmon'
//   }
// });



import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image} from 'react-native';
var Camera = require('react-native-camera');
import genStyles from '../common/styles';
//import { RNS3 } from 'react-native-aws3';


export default class Cam extends React.Component {
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
      this.setState({photo: data});
      console.log('data.path-------------->', data.path)
      console.log('data-------------->', data)
      console.log(this.state.photo);
      console.log(this.state.cameraTarget);
      AsyncStorage.setItem('photo', data);

      const file = {
        uri: data,
        name: 'photo.jpg',
        type: 'image/jpg'
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
            console.log("<-------------------------------------->")
            console.log("*****F A I L*******", response)
            throw new Error('Failed to upload image to S3', response);
          }
          console.log('*** BODY ***', response.body);
        });
      //  this.props.navigator.pop();
    }
  }


  render() {

    return (
      <View>
        <Camera ref={(cam) => {this.camera = cam;}}
                captureTarget={this.state.cameraTarget}
                type={this.state.cameraType}
                style={styles.container}
                aspect={Camera.constants.Aspect.fill}
                captureAudio={false}
                >
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
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
