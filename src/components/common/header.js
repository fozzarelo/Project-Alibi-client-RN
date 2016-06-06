import React, { Component } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import genStyles from './styles';

export default class Header extends React.Component {
  render() {
    return (
      <View style={genStyles.box}>
        <Text style={genStyles.headerText}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}
