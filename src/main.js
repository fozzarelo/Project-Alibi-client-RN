import React, { Component } from 'react';
import {StyleSheet, Navigator, AsyncStorage} from 'react-native';

import Signin from './components/authentication/signin';
import Signup from './components/authentication/signup';
import Tweets from './components/tweets/tweets';
import Send from './components/stamps/send';

var ROUTES = {signin: Signin,   signup: Signup,
              tweets: Tweets,   send: Send}


export default class Main extends React.Component{
  constructor() {
    super();
    this.state = {username: '', iniRoute: ''};
  }
  componentWillMount() {
    AsyncStorage.getItem('email')
      .then( () => {this.setState({iniRoute: 'send'});
      });
  }

  renderScene(route, navigator) {
    let Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator}/>;
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
