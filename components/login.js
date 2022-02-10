import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@spacebook_details', jsonValue)
    }
    catch (e) {
        console.error(e);
    }
}

class LoginScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    login = () => {
        fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then((response) => response.json())
        .then((json) => {
            storeData(json);
            this.setState({email: ""});
            this.setState({password: ""});
            this.props.navigation.navigate("Main");
        })
        .catch((error) => {
            console.error(error);
        })
    }

    signUp = () => {
        this.props.navigation.navigate("SignUp");
    }

    render(){
        return (
            <View>
                <Text>Login</Text>
                <TextInput
                    placeholder="Enter email"
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                />
                 <TextInput
                    placeholder="Enter password"
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                <Button 
                    title="Login"
                    onPress={() => this.login()}
                />
                <Text>Not registered?</Text> 
                <Button
                    title="Sign-Up"
                    onPress={() => this.signUp()}
                />
            </View>
        );
    }
}

export default LoginScreen;