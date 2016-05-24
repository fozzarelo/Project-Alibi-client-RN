import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
var Button = require('../common/button');

module.exports = React.createClass({
  getInitialState(){
    return {
      username: '',
      password: ''
    };
  },
  render: function(){
    return (
      <View style={styles.container}>
        <Text>Sign In</Text>

        <Text style={styles.label}>User:</Text>
        <TextInput  style={styles.input}
                    value={this.state.username}
                    onChangeText={(text) => this.setState({username: text})}
                    />
        <Text style={styles.label}>Password:</Text>
        <TextInput  secureTextEntry={true} style={styles.input}
                    value={this.state.password}
                    onChangeText={(text) => this.setState({password: text})}
        />
        <Button text={'Sign in'} onPress={this.onPress}/>
      </View>
    );
  },
  onPress: function(){
    //Log user in
    this.setState({password: ''});
  }
});

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  input: {
    padding: 4,
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    width: 200,
    alignSelf: 'center'
  },
  label: {
    fontSize: 18,
  }
});
