import React, { Component } from 'react';
import { View, Text, Image, Button, FlatList, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getLoginDetails } from './helpers';

class UserProfileScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            loggedInUserInfo: {},
            loggedInUserFriends: [],
            loggedInUserFriendRequests: [],
            userInfo: this.props.route.params.item,
            userPosts: [],
            newPostText: "",
            profileImage: null,
            showSendFriendRequest: false,
            showUserPosts: true
        }; 
    }

    checkLoggedIn = async () => {
        let data = await getLoginDetails();
        if (data.token == null) {
            this.props.navigation.navigate('Login');
        }
    };

    sendFriendRequest = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
        })
        .catch((error) => {
            console.error(error);
        })
    }

    checkIfAlreadyFriends = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/post`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
        })
        .then((response) => {
            if (response.status === 403)
            {
                this.setState({showSendFriendRequest: true})
                this.setState({showUserPosts: false})
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

    loadProfileImage = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/photo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'image/png',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
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

    loadUserPosts = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/post`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
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
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
            body: JSON.stringify({
                text: this.state.newPostText
            })
        })
        .catch((error) => {
            console.error(error);
        })
    }

    async componentDidMount() {
        const data = await getLoginDetails();
        this.setState({
            loggedInUserInfo: data
        }, () => {
            this.loadProfileImage();
            this.loadUserPosts();
            this.checkIfAlreadyFriends();
        });
        
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.loadProfileImage();
            this.loadUserPosts();
            this.checkIfAlreadyFriends();
          });
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    render(){
        return (
            <View>
                <Text>{this.state.userInfo.user_givenname}</Text>
                <Text>{this.state.userInfo.user_familyname}</Text>
                <Image 
                    source={{uri: this.state.profileImage}}
                    style={{width: 100, height: 100}}
                />
                <View style={{display: this.state.showSendFriendRequest ? 'flex' : 'none'}}>
                    <Button
                        title="Send friend request"
                        onPress={() => this.sendFriendRequest()}
                    />
                </View>

                <View style={{display: this.state.showUserPosts ? 'flex' : 'none'}}>
                    <Text>Add a new post to {this.state.userInfo.user_givenname}'s wall</Text>
                    <TextInput
                        placeholder="What are you thinking?"
                        onChangeText={(text) => {
                            this.setState({newPostText: text})
                        }}
                        value={this.state.newPostText}
                    />
                    <Button
                        title="Add"
                        onPress={() => {
                            this.addNewPost()
                            this.loadUserPosts()
                        }}
                    />

                    <Text> Posts: </Text>
                    <FlatList
                        data={this.state.userPosts}
                        renderItem={({item, index}) => 
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate("Post", 
                                    {
                                        postId: item.post_id,
                                        userId: this.state.userInfo.user_id
                                    });
                                }
                                }
                            >
                                <Text>{item.text}</Text>
                            </TouchableOpacity>
                    }>
                    </FlatList>
                </View>
            </View>
        );
    }
}

export default UserProfileScreen;