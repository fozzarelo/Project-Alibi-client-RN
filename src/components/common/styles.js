
'use strict';
var React = require('react-native');
var {StyleSheet, Dimensions} = React;


var primary = "#D4CFCC";
var secondary = "#453F41";
var sidebar = "#090505";

var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'silver'
  },
  headerText: {
    color: 'black',
    alignSelf: 'center',
    fontSize: 30,
    marginTop: 50,
  },
  box: {
    width: deviceWidth,
    height: 60,
    marginBottom: 100,
    backgroundColor: secondary,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'transparent',
    color: 'grey',
    padding: 4,
    height: 40,
    borderColor: '#05A5D1',
    borderWidth: 1,
    borderRadius: 5,
    margin: 1,
    width: 220,
    alignSelf: 'center'
  },
  notification: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 24,
    color: 'purple',
  },
  redLabel: {
    fontSize: 18,
    color: 'red'
  },
  footer: {
    flexDirection:'row',
    width: deviceWidth,
    height: 80,
    backgroundColor: 'black',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop:0
  }
});
