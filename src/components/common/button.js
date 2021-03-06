import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

export default class Button extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor={'gray'}
        onPress={this.props.onPress}
        >
        <Text style={styles.buttonText}>
          {this.props.text}
        </Text>
      </TouchableHighlight>
    );
  }
}
var styles = StyleSheet.create({
  button: {
    backgroundColor: '#05A5D1',
      padding: 10,
      borderColor: 'transparent',
      borderWidth:2,
      alignSelf: 'center',
    borderRadius: 10,
    width: 100,
    height: 45,
    marginTop: 16
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 14
  }
});
