import React, { Component } from 'react';
import { View, Text, Image, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async (done) => {
    try {
        const json = await AsyncStorage.getItem('@spacebook_details')
        const data = JSON.parse(json);
        return done(data);
    } catch(e) {
        console.error(e);
    }
}

class ProfileScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            loginInfo: {},
            originalUserInfo: {},
            newFirstName: "",
            newLastName: "",
            newEmail: "",
            newPassword: "",
            profileImage: null,
            showEditProfile: false,
        }; 
    }

    loadUserDetails = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => response.json())
        .then((json) => {
            this.setState({originalUserInfo: json});
        })
        .catch((error) => {
            console.error(error);
        })
    }

    loadProfileImage = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}/photo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'image/png',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => {
            return response.blob();
        })
        .then((resBlob) => {
            let data = URL.createObjectURL(resBlob);
            this.setState({profileImage: data});
        })
        .catch((error) => {
            console.error(error);
        })
    }

    editProfile = () => {
        this.setState({showEditProfile: !this.state.showEditProfile});
    }

    updateProfileInfo = () => {
        let to_send = {};

        if ((this.state.newFirstName != "") && (this.state.newFirstName != this.state.originalUserInfo.first_name)){
            to_send['first_name'] = this.state.newFirstName;
        }

        if ((this.state.newLastName != "") && (this.state.newLastName != this.state.originalUserInfo.last_name)){
            to_send['last_name'] = this.state.newLastName;
        }

        if ((this.state.newEmail != "") && (this.state.newEmail != this.state.originalUserInfo.email)){
            to_send['email'] = this.state.newEmail;
        }

        if (this.state.newPassword != ""){
            to_send['password'] = this.state.newPassword;
        }

        return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'X-Authorization': `${this.state.loginInfo.token}`,
        },
        body: JSON.stringify(to_send)
        })
        .then(() => {
            console.log("Item updated");
        })
        .then(() => this.loadUserDetails())
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        getData((data) => {
            this.setState({
                loginInfo: data
            }, () => this.loadUserDetails());
        })
        .then(() => this.loadProfileImage());    
    }

    render(){
        return (
            <View>
                <Text>{this.state.originalUserInfo.first_name}</Text>
                <Text>{this.state.originalUserInfo.last_name}</Text>
                <Image 
                    source={{uri: this.state.profileImage}}
                    style={{width: 100, height: 100}}
                />
                <Button
                    title="Edit Profile"
                    onPress={() => this.editProfile()}
                />
                <View style={{display: this.state.showEditProfile ? 'flex' : 'none'}}>
                    <TextInput
                        placeholder={this.state.originalUserInfo.email}
                        onChangeText={(email) => {
                            this.setState({newEmail: email})}
                        }
                        value={this.state.newEmail}
                    />
                    <TextInput
                        placeholder={this.state.originalUserInfo.first_name}
                        onChangeText={(firstName) => {
                            this.setState({newFirstName: firstName})}
                        }
                        value={this.state.newFirstName}
                    />
                    <TextInput
                        placeholder={this.state.originalUserInfo.last_name}
                        onChangeText={(lastName) => {
                            this.setState({newLastName: lastName})}
                        }
                        value={this.state.newLastName}
                    />
                    <TextInput
                        placeholder="Enter New Password"
                        onChangeText={(password) => {
                            this.setState({newPassword: password})}
                        }
                        value={this.state.newPassword}
                    />
                    <Button
                        title="Update"
                        onPress={() => this.updateProfileInfo()}
                    />
                </View>
            </View>
        );
    }
}

export default ProfileScreen;