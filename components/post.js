import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

import { getLoginDetails } from './helpers';

class PostScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            loginInfo: {},
            postId: this.props.route.params.postId,
            userId: this.props.route.params.userId,
            post: {},
            author: {},
            newPostText: "",
            showOwnPostMessage: false,
            showAlreadyLikedMessage: false,
            disableLikeButton: false,
            showUnlikeButton: false,
            showUpdateDeletePost: false,
        }
    }

    async componentDidMount() {
        const data = await getLoginDetails();
        this.setState({
            loginInfo: data
        });
        
        this.getPostDetails();

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getPostDetails();
        });
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        let data = await getLoginDetails();
        if (data == null) {
            this.props.navigation.navigate('Login');
        }
    };

    getPostDetails = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => response.json())
        .then((json) => {
            this.setState({post: json, author: json.author})
            if (json.author.user_id == this.state.loginInfo.id)
            {
                this.setState({disableLikeButton: true})
                this.setState({showOwnPostMessage: true})
                this.setState({showUpdateDeletePost: true})
            }
            else if (this.state.userId == this.state.loginInfo.id)
            {
                this.setState({disableLikeButton: true})
                this.setState({showOwnPostMessage: true})
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

    likePost = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => {
            if (response.status === 400)
            {
                this.setState({showAlreadyLikedMessage: true})
                this.setState({disableLikeButton: true})
                this.setState({showUnlikeButton: true})
            }
            else if (response.status === 200)
            {
                this.setState({disableLikeButton: true})
                this.setState({showUnlikeButton: true})
                this.getPostDetails()
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

    removeLikeFromPost = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}/like`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => {
            if (response.status === 200)
            {
                this.setState({showAlreadyLikedMessage: false})
                this.setState({disableLikeButton: false})
                this.setState({showUnlikeButton: false})
                this.getPostDetails()
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

    updatePost = () => {
        let to_send_post = {};

        if ((this.state.newPostText != "") && (this.state.newPostText != this.state.post.text)){
            to_send_post['text'] = this.state.newPostText;
        }
        to_send_post['author'] = this.state.author;
        to_send_post['post_id'] = this.state.postId;
        to_send_post['numLikes'] = this.state.post.numLikes;
        to_send_post['timestamp'] = Date.now();


        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
            body: JSON.stringify(to_send_post)
        })
        .then((response) => {
            if (response.status === 200)
            {
                this.getPostDetails()
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

    deletePost = () => {
        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => {
            if (response.status === 200)
            {
                this.props.navigation.goBack();
            }
        })
        .catch((error) => {
            console.error(error);
        })

    }

    render(){
        return (
            <View>
                <Text> Author: {this.state.author.first_name} {this.state.author.last_name}</Text>
                <Text>{this.state.post.text}</Text>
                <Text>Likes: {this.state.post.numLikes}</Text>
                <Button
                    title="Like"
                    disabled={this.state.disableLikeButton}
                    onPress={() => {
                        this.likePost()
                    }}
                ></Button>
                <View style={{display: this.state.showUnlikeButton ? 'flex' : 'none'}}>
                    <Button
                        title="Unlike"
                        onPress={() => {
                            this.removeLikeFromPost()
                        }}
                    ></Button>
                </View>

                <Text 
                    style={{display: this.state.showAlreadyLikedMessage ? 'flex' : 'none'}}> 
                    You've already liked this post! want to remove your like? 
                </Text>
                <Text 
                    style={{display: this.state.showOwnPostMessage ? 'flex' : 'none'}}> 
                    You can't like your own post! 
                </Text>

                <View style={{display: this.state.showUpdateDeletePost ? 'flex' : 'none'}}>
                    <TextInput
                        placeholder={this.state.post.text}
                        onChangeText={(text) => {
                            this.setState({newPostText: text})}
                        }
                        value={this.state.newPostText}
                    />
                    <Button
                        title="Update Post"
                        onPress={() => this.updatePost()}
                    ></Button>
                    <Button
                        title="Remove Post"
                        onPress={() => this.deletePost()}
                    ></Button>
                </View>
            </View>
        );
    }
}

export default PostScreen;