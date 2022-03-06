import React, { Component } from 'react';
import { View, Text, Image, TextInput, Button, FlatList } from 'react-native';
import { getLoginDetails } from './helpers';

class ProfileScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            loginInfo: {},
            userPosts: [],
            newPostText: "",
            originalUserInfo: {},
            newFirstName: "",
            newLastName: "",
            newEmail: "",
            newPassword: "",
            profileImage: null,
            showEditProfile: false,
        }; 
    }

    checkLoggedIn = async () => {
        let data = await getLoginDetails();
        if (data.token == null) {
            this.props.navigation.navigate('Login');
        }
    };

    loadUserPosts = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}/post`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => response.json())
        .then((json) => {
            this.setState({userPosts: json});
        })
        .catch((error) => {
            console.error(error);
        })

    }

    addNewPost = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
            body: JSON.stringify({
                text: this.state.newPostText
            })
        })
        .catch((error) => {
            console.error(error);
        })
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
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}/photo?` + Date.now(), {
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

    async componentDidMount() {
        const data = await getLoginDetails();
        this.setState({
            loginInfo: data
        }, () => {
            this.loadUserDetails();
            this.loadProfileImage();
            this.loadUserPosts();
        });
        
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.loadUserDetails();
            this.loadProfileImage();
            this.loadUserPosts();
          });
    }

    componentWillUnmount(){
        this._unsubscribe();
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
                        title="Update Profile Picture"
                        onPress={() => this.props.navigation.navigate("ProfileCamera")}
                    />
                    <Button
                        title="Update"
                        onPress={() => this.updateProfileInfo()}
                    />
                </View>

                <Text>Add a new post</Text>
                <TextInput
                    placeholder="What are you thinking?"
                    onChangeText={(text) => {
                        this.setState({newPostText: text})
                    }}
                    value={this.state.newPostText}
                />
                <Button
                    title="Add"
                    onPress={() => this.addNewPost()}
                />

                <Text> Posts: </Text>
                <FlatList
                    data={this.state.userPosts}
                    renderItem={({item, index}) => 
                        <View>
                            <Text>This is the title of a post! </Text>
                            <Text>{item.text} </Text>
                        </View>
                }>
                </FlatList>
            </View>
        );
    }
}

export default ProfileScreen;