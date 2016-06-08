import React, { Component } from 'react';
import {StyleSheet, Navigator, AsyncStorage} from 'react-native';

import Signin from './components/authentication/signin';
import Send from './components/stamps/send';
import Cam from './components/stamps/camera';
import StampsList from './components/stamps/stampsList';

import Drop from './components/common/dropDown';
import AddUser from './components/common/addUser';


var ROUTES = {signin: Signin,   addUser:  AddUser,
              send:   Send,     cam: Cam,
              dropDown: Drop,   stampsList: StampsList}


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
        initialRoute={{name: 'send'}}
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
