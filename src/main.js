import React, { Component } from 'react';
import {StyleSheet, Navigator, AsyncStorage} from 'react-native';

import Signin from './components/authentication/signin';
import Tweets from './components/tweets/tweets';
import Send from './components/stamps/send';
import Stamps from './components/stamps/stamps';
import Drop from './components/common/dropDown';
import AddUser from './components/common/addUser';

var ROUTES = {signin: Signin,   addUser:  AddUser,
              tweets: Tweets,   send:     Send,
              stamps: Stamps,   dropDown: Drop}


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

// TODO regresa aqui para arreglar el initial route!
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
