
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
    justifyContent: 'space-around',
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
  shadow: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent'
  },
  shadow2: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'transparent',
    marginTop: -35
  },
  color: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: primary
  },
  textInput: {
    backgroundColor: 'transparent',
    color: 'grey',
    padding: 4,
    height: 35,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    width: 200,
    alignSelf: 'center'
  },
  bg : {
    flex: 1,
    marginTop: deviceHeight/1.75,
    backgroundColor: secondary,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
    bottom: 0
  },
  loginLogo: {
    width: 100,
  },
  background: {
        flex: 1,
        resizeMode: 'stretch'
    },
  logo: {
    marginBottom: 50,
    marginTop: -20,
    height: 150,
    width: 150,
    alignSelf: 'center'
  },
  label: {
    fontSize: 18
  },
  redLabel: {
    fontSize: 18,
    color: 'red'
  }
});
