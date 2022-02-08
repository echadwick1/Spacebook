import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View>
                <Text>These are your friends and friend requests</Text>
            </View>
        );
    }
}

export default FriendsScreen;