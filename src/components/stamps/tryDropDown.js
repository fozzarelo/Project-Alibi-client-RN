import React, { Component } from 'react';

import {
  AppRegistry,
  Text,
  View,
  Picker,
} from 'react-native';

export default class Drop extends Component {

    constructor(context,props){
        super(context,props);
        this.state = {
             selectedValue: 'c++',
        };
    }

    onValueChange(key, value) {
      this.setState({
          selectedValue : key,
      });
    }

    render() {
      return (
          <View >
             <Text>
                Choose a language
             </Text>

             <Picker
               selectedValue={this.state.selectedValue}
               onValueChange={this.onValueChange.bind(this)}>
               <Picker.Item label="C" value="c" />
               <Picker.Item label="C++" value="c++" />
               <Picker.Item label="Java" value="java" />
               <Picker.Item label="JavaScript" value="js" />
             </Picker>

             <Text>Selected language is {this.state.selectedValue}</Text>
          </View>
      );
    }
}
