/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, Button, TextInput, StyleSheet,
} from 'react-native';
import { storeLoginDetails } from './helpers';

const styles = StyleSheet.create({
  titleMain: {
    padding: 30,
    fontSize: 30,
    color: 'rgb(255, 255, 255)',
    alignSelf: 'center',
  },
  title: {
    padding: 10,
    fontSize: 22,
    color: 'rgb(255, 255, 255)',
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  loginSection: {
    alignItems: 'center',
    paddingTop: 150,
  },
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  login = () => {
    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        storeLoginDetails(json);
        this.setState({ email: '' });
        this.setState({ password: '' });
        this.props.navigation.navigate('Main');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  signUp = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleMain}> Welcome to Spacebook!</Text>

        <View style={styles.loginSection}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            placeholder="Enter email"
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            placeholder="Enter password"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
          />
          <Button
            title="Login"
            onPress={() => this.login()}
          />
          <Text style={styles.title}>Not registered?</Text>
          <Button
            title="Sign-Up"
            onPress={() => this.signUp()}
          />
        </View>
      </View>
    );
  }
}

export default LoginScreen;
