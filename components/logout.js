/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  Button, View, Text, StyleSheet,
} from 'react-native';
import { getLoginDetails, removeLoginDetails } from './helpers';

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class LogoutScreen extends Component {
  signOut = async () => {
    const data = await getLoginDetails();
    await removeLoginDetails();
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': data.token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Are you sure you want to sign out?</Text>
        <Button title="Yes" onPress={() => this.signOut()} />
        <Button title="No" onPress={() => this.props.navigation.goBack()} />
      </View>
    );
  }
}

export default LogoutScreen;
