import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

module.exports = React.createClass({
  render: function(){
    return (
      <TouchableHighlight
        underlayColor={'gray'}
        style={styles.button}
        onPress={this.props.onPress}
        >
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
});
var styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: 'black',
    marginTop: 10
  },
  buttonText: {
    fontSize: 20,
    flex: 1,
    alignSelf: 'center'
  }
});
