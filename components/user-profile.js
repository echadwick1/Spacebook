/* eslint-disable linebreak-style */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, Image, Button, FlatList, TextInput, StyleSheet,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getLoginDetails } from './helpers';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f63ab',
  },
  userInfoSection: {
    padding: 10,
    margin: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#7da2c9',
  },
  profileName: {
    fontSize: 20,
  },
  editProfileSection: {
    padding: 10,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#7da2c9',
  },
  userPostsSection: {
    padding: 10,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#7da2c9',
  },
  userPostsItem: {
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    height: 75,
    backgroundColor: 'white',
  },
  userPostContent: {
    fontSize: 22,
    padding: 5,
  },
  title: {
    fontSize: 24,
    paddingBottom: 5,
  },
  button: {
    color: '#1f63ab',
  },
});

class UserProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInUserInfo: {},
      userInfo: this.props.route.params.item,
      userPosts: [],
      newPostText: '',
      profileImage: null,
      showSendFriendRequest: true,
      showAlreadySentMessage: false,
      showSentMessage: false,
      showUserPosts: true,
      showButton: false,
    };
  }

  async componentDidMount() {
    const data = await getLoginDetails();
    this.setState({
      loggedInUserInfo: data,
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

  componentWillUnmount() {
    this._unsubscribe();
  }

  checkLoggedIn = async () => {
    const data = await getLoginDetails();
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
      .then((response) => {
        if (response.status === 200) {
          this.setState({ showSendFriendRequest: false });
          this.setState({ showSentMessage: true });
        } else if (response.status === 403) {
          this.setState({ showSendFriendRequest: false });
          this.setState({ showAlreadySentMessage: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  checkIfAlreadyFriends = () => {
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/post`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `${this.state.loggedInUserInfo.token}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          this.setState({ showButton: true });
          this.setState({ showUserPosts: false });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  loadProfileImage = () => {
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/photo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': `${this.state.loggedInUserInfo.token}`,
      },
    })
      .then((response) => response.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({ profileImage: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
        this.setState({ userPosts: json });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  addNewPost = () => {
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userInfo.user_id}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `${this.state.loggedInUserInfo.token}`,
      },
      body: JSON.stringify({
        text: this.state.newPostText,
      }),
    })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userInfoSection}>
          <Image
            source={{ uri: this.state.profileImage }}
            style={{ width: '45%', height: 150 }}
          />
          <Text style={styles.profileName}>{this.state.userInfo.user_givenname}</Text>
          <Text style={styles.profileName}>{this.state.userInfo.user_familyname}</Text>
        </View>

        <View style={{ display: this.state.showButton ? 'flex' : 'none' }}>
          <Button
            title="Send friend request"
            disabled={!this.state.showSendFriendRequest}
            onPress={() => this.sendFriendRequest()}
          />
        </View>
        <Text style={{ display: this.state.showAlreadySentMessage ? 'flex' : 'none' }}>You have already sent a friend request!</Text>
        <Text style={{ display: this.state.showSentMessage ? 'flex' : 'none' }}>Friend Request Sent!</Text>

        <View style={{ display: (this.state.showUserPosts ? 'flex' : 'none') }}>
          <View style={styles.userPostsSection}>
            <Text style={styles.title}>
              Add a new post to
              {' '}
              {this.state.userInfo.user_givenname}
              's wall
            </Text>
            <TextInput
              placeholder="What are you thinking?"
              onChangeText={(text) => {
                this.setState({ newPostText: text });
              }}
              value={this.state.newPostText}
            />
            <Button
              title="Add"
              onPress={() => {
                this.addNewPost();
                this.loadUserPosts();
              }}
            />

            <Text style={styles.title}>Posts: </Text>
            <ScrollView>
              <FlatList
                data={this.state.userPosts}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userPostsItem}
                    onPress={() => {
                      this.props.navigation.navigate(
                        'Post',
                        {
                          postId: item.post_id,
                          userId: this.state.userInfo.user_id,
                        },
                      );
                    }}
                  >
                    <Text style={styles.userPostContent}>{item.text}</Text>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

export default UserProfileScreen;
