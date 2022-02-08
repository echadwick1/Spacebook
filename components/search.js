import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

class SearchScreen extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View>
                <Text>This is where you can search for users </Text>
            </View>
        );
    }
}

export default SearchScreen;