import React, { Component } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { getLoginDetails } from './helpers';

class FriendsScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            friendRequests: [],
            friends: [],
            loggedInUserInfo: {},
        }
    }

    async componentDidMount() {
        const data = await getLoginDetails();
        this.setState({
            loggedInUserInfo: data
        });

        this.getMyFriendRequests();
        this.getMyFriends();              

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
    }

    componentWillUnmount(){
        this._unsubscribe();
    }
    
    checkLoggedIn = async () => {
        let data = await getLoginDetails()
        if (data == null) {
            this.props.navigation.navigate('Login');
        }
    };

    getMyFriends = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loggedInUserInfo.id}/friends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
        })
        .then((response) => response.json())
        .then((json) => this.setState({friends: json}))
        .catch((error) => {
            console.error(error);
        })
    }

    getMyFriendRequests = () => {
        fetch(`http://localhost:3333/api/1.0.0/friendrequests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
        })
        .then((response) => response.json())
        .then((json) => this.setState({friendRequests: json}))
        .catch((error) => {
            console.error(error);
        })
    }

    acceptFriendRequest = (userId) => {
        fetch(`http://localhost:3333/api/1.0.0/friendrequests/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
        })
        .then(() => this.getMyFriendRequests())
        .then(() => this.getMyFriends())
        .catch((error) => {
            console.error(error);
        })
    }

    rejectFriendRequest = (userId) => {
        fetch(`http://localhost:3333/api/1.0.0/friendrequests/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
        })
        .then(() => this.getMyFriendRequests())
        .then(() => this.getMyFriends())
        .catch((error) => {
            console.error(error);
        })
    }

    render(){
        return (
            <View>
                <View>
                    <Text>Outstanding Friend Requests:</Text>

                    <FlatList
                        data={this.state.friendRequests}
                        renderItem={({item, index}) => 
                            <View>
                                <Text>{item.first_name}</Text>
                                <Text>{item.last_name}</Text>
                                <Button
                                    title="Accept"
                                    onPress={() => this.acceptFriendRequest(item.user_id)}
                                />
                                <Button
                                    title="Reject"
                                    onPress={() => this.rejectFriendRequest(item.user_id)}
                                />
                            </View>
                        }
                    />
                </View>
                <View>
                    <Text>My Friends:</Text>

                    <FlatList
                        data={this.state.friends}
                        renderItem={({item, index}) => 
                            <View>
                                <Text>{item.user_givenname}</Text>
                                <Text>{item.user_familyname}</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        );
    }
}

export default FriendsScreen;