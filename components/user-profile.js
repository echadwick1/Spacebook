import React, { Component } from 'react';
import { View, Text, Image, Button} from 'react-native';
import { getLoginDetails } from './helpers';

class UserProfileScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            loggedInUserInfo: {},
            loggedInUserFriends: [],
            loggedInUserFriendRequests: [],
            userInfo: this.props.route.params.item,
            profileImage: null,
            showSendFriendRequest: false,
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
        .then((response) => console.log(response))
        .then(this.showSendFriendRequest())
        .catch((error) => {
            console.error(error);
        })
    }

    showSendFriendRequest = () => {
        this.getMyFriends();
        this.getMyFriendRequests();
        let userId = this.state.userInfo.user_id
        let alreadyFriends = false
        this.state.loggedInUserFriends.forEach((item) => {
            if (item.user_id == userId)
            {
                alreadyFriends = true;
            }
        })
        if (this.state.loggedInUserFriends.includes(user))
        {
            console.log("Already a friend")
            this.setState({showSendFriendRequest: false});
        }
        else if (this.state.loggedInUserFriendRequests.includes(user))
        {
            console.log("already requested")
            this.setState({showSendFriendRequest: false});
        }
        else 
        {
            this.setState({showSendFriendRequest: true});
        }
    }

    getMyFriends = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loggedInUserInfo.id}/friends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loggedInUserInfo.token}`,
            },
        })
        .then((response) => response.json())
        .then((json) => this.setState({loggedInUserFriends: json}))
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
        .then((json) => this.setState({loggedInUserFriendRequests: json}))
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

    async componentDidMount() {
        const data = await getLoginDetails();
        this.setState({
            loggedInUserInfo: data
        }, () => {
            this.loadProfileImage();
        });

        this.showSendFriendRequest();

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
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
            </View>
        );
    }
}

export default UserProfileScreen;