/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, Button, TextInput,
} from 'react-native';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    };
  }

  signUp = () => {
    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <View>
        <Text>Sign Up</Text>
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
        <TextInput
          placeholder="Enter first name"
          onChangeText={(firstName) => this.setState({ firstName })}
          value={this.state.firstName}
        />
        <TextInput
          placeholder="Enter last name"
          onChangeText={(lastName) => this.setState({ lastName })}
          value={this.state.lastName}
        />
        <Button
          title="Sign Up"
          onPress={() => this.signUp()}
        />
      </View>
    );
  }
}

export default SignUpScreen;
