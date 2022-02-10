import React, { Component } from 'react';
import { Button, Text, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component {
    constructor(props){
        super(props);
    }

    signOut = async () => {
        let token = await AsyncStorage.getItem('@spacebook_details');
        await AsyncStorage.removeItem('@spacebook_details');
        const data = JSON.parse(token);
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'POST',
            headers: {
                "X-Authorization": data.token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <DrawerContentScrollView>
                <Button
                    title="I'm outta here"
                    onPress={() => this.signOut()}
                />
            </DrawerContentScrollView>
        )
    }
}

export default LogoutScreen;