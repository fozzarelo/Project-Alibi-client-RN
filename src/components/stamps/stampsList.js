'use strict';
import genStyles from '../common/styles';
import DropDown from '../common/dropDown';
import { Button } from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react';
import {TouchableOpacity,       AlertIndicatorIOS,      ActivityIndicatorIOS,
        AlertIOS,               StyleSheet,             Text,
        View,                   AsyncStorage,           Animated,
        Dimensions, ListView} from 'react-native';

var API_URL = 'http://demo9383702.mockable.io/users';

export default class StampsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.bindMethods();
    }

    bindMethods() {
        if (! this.bindableMethods) {
            return;
        }

        for (var methodName in this.bindableMethods) {
            this[methodName] = this.bindableMethods[methodName].bind(this);
        }
    }

    initialState() {
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        }

        return {
            loaded : false,
            dataSource : new ListView.DataSource({
                getSectionData          : getSectionData,
                getRowData              : getRowData,
                rowHasChanged           : (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged : (s1, s2) => s1 !== s2
            })
        }
    }

    componentDidMount() {
      AsyncStorage.getItem('email')
        .then( mail => {
           this.setState({email: mail})
           console.log("after getting the mail", this.state.email)
           this.fetchData();
        })

    }

    fetchData () {

      console.log("----in get list with mail<<-------------", this.state.email)
          let url = `http://172.20.10.3:3000/api/v1/messages/getMessages?token=12&email=${this.state.email}`;
          console.log(url)
          let request = new Request(url, {
            method: 'POST',
            headers: new Headers({'Content-Type': 'text/plain'})
          });

          console.log("----sending request-------------", url)
          fetch(request)
            .then((response) => {
              return response.json();
            })
            .then((messages) => {
                console.log("Retrieved messages!", messages)
                this.setState({messages: messages})
              })
              var hardcode =
              {
                "results": [{
                  "organization": "Pins Sent",
                  "id": 12348124,
                  "users": [{
                    "user": {
                      "gender": "female",
                      "name": {
                        "title": "Evlyn",
                        "first": " JUN 05 - 12:48",
                        "last": ""
                      },
                      "location": {
                        "street": "9234 kintgenshaven",
                        "city": "epe",
                        "state": "groningen",
                        "zip": "24360"
                      },
                      "email": "evlynka@gmail.com",
                      "username": "orangeleopard377",
                      "password": "427900",
                      "salt": "KrIEhHan",
                      "md5": "589a574553250be33f3b1170624ad2d1",
                      "sha1": "b95ebe39ae6119c5d578938b2d0be8abf674d22c",
                      "sha256": "591584f0bcd6ab1700b59f7bad4ef84917d9ad1270a5a3f4fdd0519fd6d6f37e",
                      "registered": "1412818529",
                      "dob": "368162464",
                      "phone": "(468)-937-2959",
                      "cell": "(971)-550-2808",
                      "BSN": "95632864",
                      "picture": {
                        "large": "http://api.randomuser.me/portraits/women/35.jpg",
                        "medium": "http://api.randomuser.me/portraits/med/women/35.jpg",
                        "thumbnail": "http://api.randomuser.me/portraits/thumb/women/35.jpg"
                      },
                      "version": "0.6",
                      "nationality": "NL"
                    },
                    "seed": "0e4de8b1953a999b06"
                  }, {
                    "user": {
                      "gender": "female",
                      "name": {
                        "title": "ms",
                        "first": "kristianne",
                        "last": "van den oetelaar"
                      },
                      "location": {
                        "street": "4802 donkerstraat",
                        "city": "sint-michielsgestel",
                        "state": "groningen",
                        "zip": "61965"
                      },
                      "email": "kristianne.van den oetelaar12@example.com",
                      "username": "ticklishmeercat405",
                      "password": "dolores",
                      "salt": "KwAVXd3o",
                      "md5": "5cbc80332e3523dd9d90cc116daf9d8e",
                      "sha1": "4d3c0dd6123eee0dfd4d2f1fd02d204cdbc66ea3",
                      "sha256": "237dd75ac4edf8655fc1df2ecdcbb9fc8bda6f13874274321d5f016422bd845e",
                      "registered": "975686912",
                      "dob": "1213287452",
                      "phone": "(544)-595-2864",
                      "cell": "(332)-676-7259",
                      "BSN": "10118205",
                      "picture": {
                        "large": "http://api.randomuser.me/portraits/women/21.jpg",
                        "medium": "http://api.randomuser.me/portraits/med/women/21.jpg",
                        "thumbnail": "http://api.randomuser.me/portraits/thumb/women/21.jpg"
                      },
                      "version": "0.6",
                      "nationality": "NL"
                    }
                  }]
              }]
              }

      fetch(API_URL).then((response) => response.json()).then((responseData) => {
          var organizations = hardcode.results,
              length = organizations.length,
              dataBlob = {},
              sectionIDs = [],
              rowIDs = [],
              organization,
              users,
              userLength,
              user,
              i,
              j;

          for (i = 0; i < length; i++) {
              organization = organizations[i];

              sectionIDs.push(organization.id);
              dataBlob[organization.id] = organization.organization;

              users = organization.users;
              userLength = users.length;

              rowIDs[i] = [];

              for(j = 0; j < userLength; j++) {
                  user = users[j].user;
                  rowIDs[i].push(user.md5);

                  dataBlob[organization.id + ':' + user.md5] = user;
              }
          }

          this.setState({
              dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
              loaded     : true
          });

      }).done();
    }

    goBackBP() {
      this.props.navigator.pop()
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return this.renderListView();
    }

    renderLoadingView() {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>Prints</Text>
                <View style={styles.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[styles.activityIndicator, {height: 80}]}
                        size="large"
                    />
                </View>
            </View>
        );
    }

    renderListView() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Messages</Text>
                </View>
                <ListView
                    dataSource = {this.state.dataSource}
                    style      = {styles.listview}
                    renderRow  = {this.renderRow}
                    renderSectionHeader = {this.renderSectionHeader}
                />
                <View style={genStyles.footer}>
                  <Button name={'md-arrow-round-back'}
                          size={60}
                          backgroundColor="transparent"
                          style={{ justifyContent: 'center' }}
                          onPress={this.goBackBP.bind(this)}
                   />
                </View>
            </View>
        );
    }

    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.text}>{sectionData}</Text>
            </View>
        );
    }
};

Object.assign(StampsList.prototype, {
    bindableMethods : {
        renderRow : function (rowData, sectionID, rowID) {
            return (
                <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                    <View style={styles.rowStyle}>
                        <Text style={styles.rowText}>{rowData.name.title} {rowData.name.first} {rowData.name.last}</Text>
                    </View>
                </TouchableOpacity>
            );
        },
        onPressRow : function (rowData, sectionID) {
            var buttons = [
                {
                    text : 'Cancel'
                },
                {
                    text    : 'OK',
                    onPress : () => this.createCalendarEvent(rowData, sectionID)
                }
            ]
            AlertIOS.alert('User\'s Email is ' + rowData.email, null, null);
        }

    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        flexDirection: 'column',
        paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    text: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    rowStyle: {
        paddingVertical: 20,
        paddingLeft: 16,
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: '#E0E0E0',
        borderWidth: 1
    },
    rowText: {
        color: '#212121',
        fontSize: 16
    },
    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#2196F3'
    }
});





// import React, { Component } from 'react';
// import {StyleSheet, Text, View, AsyncStorage, Animated, Dimensions, ListView} from 'react-native';
// import genStyles from '../common/styles';
// import DropDown from '../common/dropDown';
// import { Button } from 'react-native-vector-icons/Ionicons';
//
// var API_URL = 'http://demo9383702.mockable.io/users';
//
// export default class StampsList extends React.Component {
//   constructor(props) {
//     super(props);
//     var getSectionData = (dataBlob, sectionID) => dataBlob[sectionID]
//     var getRowData = (dataBlob, sectionID, rowID) => dataBlob[sectionID + ':' + rowID]
//     this.bindMethods();
//     return {
//       loaded : false,
//       email: '',
//       messages: [],
//       errorMessage: '',
//       fade: new Animated.Value(1),
//       dataSource : new ListView.DataSource({
//         getSectionData          : getSectionData,
//         getRowData              : getRowData,
//         rowHasChanged           : (row1, row2) => row1 !== row2,
//         sectionHeaderHasChanged : (s1, s2) => s1 !== s2
//       })
//     }
//   }
//
//   bindMethods() {
//     if (! this.bindableMethods) {
//         return;
//     }
//     for (var methodName in this.bindableMethods) {
//         this[methodName] = this.bindableMethods[methodName].bind(this);
//     }
//   }
//
//   componentWillMount() {
//     AsyncStorage.getItem('email')
//       .then( mail => {
//         this.setState({email: mail})
//         console.log("after getting the mail", this.state.email)
//         this.getList.bind(this)()
//       })
//   }
//
//   getList(){
//     console.log("----in get list with mail<<-------------", this.state.email)
//     this.setState({errorMessage: null});
//     this.state.fade.setValue(1);
//     let url = `http://192.168.0.15:3000/api/v1/messages/getMessages?token=12&email=${this.state.email}`;
//     console.log(url)
//     let request = new Request(url, {
//       method: 'POST',
//       headers: new Headers({'Content-Type': 'text/plain'})
//     });
//
//     console.log("----sending request-------------", url)
//     fetch(request)
//       .then((response) => {
//         return response.json();
//       })
//       .then((messages) => {
//         if (messages.error) {
//           this.setState({errorMessage: messages.error});
//           Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
//         }
//         else {
//           console.log("Retrieved messages!", messages)
//           this.setState({messages: messages})
//         }
//       })
//       .catch(() => {
//         this.setState({errorMessage: 'Connection error'});
//         Animated.timing(this.state.fade, {toValue: 0, duration: 3000}).start();
//       })
//   }
//
//   goBackBP(){
//     this.props.navigator.pop()
//   }
//
//   render (){
//     return (
//       <View style={genStyles.container}>
//         <View style={genStyles.footer}>
//           <Button name={'md-arrow-round-back'}
//                   size={60}
//                   backgroundColor="transparent"
//                   style={{ justifyContent: 'center' }}
//                   onPress={this.goBackBP.bind(this)}
//           />
//         </View>
//       </View>
//     )
//   }
// }
// var hardcode =
// {
//   "results": [{
//     "organization": "Broadcast Instructional Mechanical",
//     "id": 12348124,
//     "users": [{
//       "user": {
//         "gender": "female",
//         "name": {
//           "title": "miss",
//           "first": "marga",
//           "last": "seegers"
//         },
//         "location": {
//           "street": "9234 kintgenshaven",
//           "city": "epe",
//           "state": "groningen",
//           "zip": "24360"
//         },
//         "email": "marga.seegers25@example.com",
//         "username": "orangeleopard377",
//         "password": "427900",
//         "salt": "KrIEhHan",
//         "md5": "589a574553250be33f3b1170624ad2d1",
//         "sha1": "b95ebe39ae6119c5d578938b2d0be8abf674d22c",
//         "sha256": "591584f0bcd6ab1700b59f7bad4ef84917d9ad1270a5a3f4fdd0519fd6d6f37e",
//         "registered": "1412818529",
//         "dob": "368162464",
//         "phone": "(468)-937-2959",
//         "cell": "(971)-550-2808",
//         "BSN": "95632864",
//         "picture": {
//           "large": "http://api.randomuser.me/portraits/women/35.jpg",
//           "medium": "http://api.randomuser.me/portraits/med/women/35.jpg",
//           "thumbnail": "http://api.randomuser.me/portraits/thumb/women/35.jpg"
//         },
//         "version": "0.6",
//         "nationality": "NL"
//       },
//       "seed": "0e4de8b1953a999b06"
//     }, {
//       "user": {
//         "gender": "female",
//         "name": {
//           "title": "ms",
//           "first": "kristianne",
//           "last": "van den oetelaar"
//         },
//         "location": {
//           "street": "4802 donkerstraat",
//           "city": "sint-michielsgestel",
//           "state": "groningen",
//           "zip": "61965"
//         },
//         "email": "kristianne.van den oetelaar12@example.com",
//         "username": "ticklishmeercat405",
//         "password": "dolores",
//         "salt": "KwAVXd3o",
//         "md5": "5cbc80332e3523dd9d90cc116daf9d8e",
//         "sha1": "4d3c0dd6123eee0dfd4d2f1fd02d204cdbc66ea3",
//         "sha256": "237dd75ac4edf8655fc1df2ecdcbb9fc8bda6f13874274321d5f016422bd845e",
//         "registered": "975686912",
//         "dob": "1213287452",
//         "phone": "(544)-595-2864",
//         "cell": "(332)-676-7259",
//         "BSN": "10118205",
//         "picture": {
//           "large": "http://api.randomuser.me/portraits/women/21.jpg",
//           "medium": "http://api.randomuser.me/portraits/med/women/21.jpg",
//           "thumbnail": "http://api.randomuser.me/portraits/thumb/women/21.jpg"
//         },
//         "version": "0.6",
//         "nationality": "NL"
//       }
//     }]
// }]
// }
