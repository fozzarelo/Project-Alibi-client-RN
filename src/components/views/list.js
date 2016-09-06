// TODO This file is not complete, remove the hardcoded list, get the info from the server instead. done!!
// TODO Try it with an empty list.. wil it work??
// TODO once you have something stable, push to the heroku server, and change the fetch so that it points to it.

'use strict';
import genStyles from '../common/styles';
import DropDown from '../common/dropDown';
import appData from '../../../keys'
import { Button } from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react';
import {TouchableOpacity,       AlertIndicatorIOS,      ActivityIndicatorIOS,
        AlertIOS,               StyleSheet,             Text,
        View,                   AsyncStorage,           Animated,
        Dimensions, ListView} from 'react-native';

export default class List extends React.Component {
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
           this.fetchData();
        })

    }

    fetchData () {
      let url = `${appData.urlBase}/messages/getMessages?token=${appData.urlToken}&email=${this.state.email}`;
      let request = new Request(url, {
        method: 'POST',
        headers: new Headers({'Content-Type': 'text/plain'})
      });

      fetch(request).then((response) => response.json()).then((responseData) => {
          var cats = responseData,
              length = cats.length,
              dataBlob = {},
              sectionIDs = [],
              rowIDs = [],
              cat,
              msgs,
              msgLength,
              msg,
              i,
              j;

          for (i = 0; i < length; i++) {
              cat = cats[i];

              sectionIDs.push(cat.id);
              dataBlob[cat.id] = cat.cat;

              msgs = cat.msgs;
              msgLength = msgs.length;

              rowIDs[i] = [];

              for(j = 0; j < msgLength; j++) {
                  msg = msgs[j].msg;
                  rowIDs[i].push(msg.md5);

                  dataBlob[cat.id + ':' + msg.md5] = msg;
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
                <Text style={styles.headerText}>Alibies</Text>
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
                    <Text style={styles.headerText}>Alibies</Text>
                </View>
                <ListView
                    dataSource = {this.state.dataSource}
                    style      = {styles.listview}
                    renderRow  = {this.renderRow}
                    renderSectionHeader = {this.renderSectionHeader}
                    enableEmptySections = {true}
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

Object.assign(List.prototype, {
    bindableMethods : {
        renderRow : function (rowData, sectionID, rowID) {
            return (
                <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                    <View style={styles.rowStyle}>
                        <Text style={styles.rowText}>{rowData.name} : {rowData.timeSent} </Text>
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
            AlertIOS.alert('Sent from: ' + rowData.location, null, null);
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
