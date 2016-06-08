import React, { Component } from 'react';
import { AppRegistry, Text, View, Picker } from 'react-native';

//export const contacts = { primo: 'email@primo', amigo: 'email@amigo' };

export default class DropDown extends React.Component {


    // TODO Need to change this component so that it can be called via props.
    // Need to be called with the contacts information from the server
    // Need to construct the picker render with the array of items given as props
    constructor(context,props){
        super(context,props);
        this.props.contacts = {};
        this.props.onValueChange = props.onValueChange;
        this.state = {selectedValue: 'email@domain.com'};
    }

    pickerItems() {
      return Object.keys(this.props.contacts).map(contact => {
        return (<Picker.Item key={contact} label={contact} value={this.props.contacts[contact]} />);
      });
    }

    // This builder uses the props, in this case they are contacts
    buildPicker(){

      return(
        <Picker
          selectedValue={this.state.selectedValue}
          onValueChange={this.onValueChange.bind(this)}>
          { this.pickerItems.bind(this)() }
        </Picker>
      )
    }

    onValueChange(value, key) {

      console.log("value",value);
      this.setState({
          selectedValue : value
      });

      this.props.onValueChange(value, key);
    }

    render() {
      return (
          <View >
             {this.buildPicker()}
          </View>
      );
    }
}
