import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

class ProfileScreen extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View>
                <Text>This is your profile</Text>
            </View>
        );
    }
}

export default ProfileScreen;