import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

class SignUpScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: ""
        }
    }

    render(){
        return (
            <View>
                <Text>Sign Up</Text>
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
                <TextInput
                    placeholder="Enter first name"
                    onChangeText={(firstName) => this.setState({firstName})}
                    value={this.state.firstName}
                />
                 <TextInput
                    placeholder="Enter last name"
                    onChangeText={(lastName) => this.setState({lastName})}
                    value={this.state.lastName}
                />
                <Button 
                    title="Sign Up"
                    onPress={() => this.signup()}
                />
            </View>
        );
    }
}

export default SignUpScreen;