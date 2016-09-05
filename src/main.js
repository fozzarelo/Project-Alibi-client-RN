import React, { Component } from 'react';
import {StyleSheet, Navigator, AsyncStorage} from 'react-native';

import SignIn from './components/views/signIn';
import Send from './components/views/send';
import Cam from './components/views/camera';
import List from './components/views/list';
import AddUser from './components/views/addUser';

import Drop from './components/common/dropDown';


var ROUTES = {signin: SignIn,   addUser:  AddUser,
              send:   Send,     cam: Cam,
              dropDown: Drop,   list: List}


export default class Main extends React.Component{
  constructor() {
    super();
    this.state = {username: '', iniRoute: ''};
  }
  componentWillMount() {
    AsyncStorage.getItem('email')
      .then( () => {
        this.setState({iniRoute: 'send'});
      })
      .catch( () => {
        this.setState({iniRoute: 'signin'});
      })
  }

  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} {...route.passProps} />;
  }


  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{name: 'signin'}}
        renderScene={this.renderScene}
        configureScene={() => { return Navigator.SceneConfigs.FloatFromRight; }}
        >
      </Navigator>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
