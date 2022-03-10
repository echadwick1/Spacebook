/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, Image, TextInput, Button, FlatList, ScrollView, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getLoginDetails } from './helpers';

const Styles = StyleSheet.create({
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

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginInfo: {},
      userPosts: [],
      newPostText: '',
      originalUserInfo: {},
      newFirstName: '',
      newLastName: '',
      newEmail: '',
      newPassword: '',
      profileImage: null,
      showEditProfile: false,
    };
  }

  async componentDidMount() {
    const data = await getLoginDetails();
    this.setState({
      loginInfo: data,
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

  componentWillUnmount() {
    this._unsubscribe();
  }

  checkLoggedIn = async () => {
    const data = await getLoginDetails();
    if (data.token == null) {
      this.props.navigation.navigate('Login');
    }
  };

  loadUserPosts = () => {
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}/post/?limit=2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `${this.state.loginInfo.token}`,
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
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `${this.state.loginInfo.token}`,
      },
      body: JSON.stringify({
        text: this.state.newPostText,
      }),
    })
      .catch((error) => {
        console.error(error);
      });
  };

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
        this.setState({ originalUserInfo: json });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  loadProfileImage = () => {
    fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}/photo?${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': `${this.state.loginInfo.token}`,
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

  editProfile = () => {
    const { showEditProfile } = this.state;
    this.setState({ showEditProfile: !showEditProfile });
  };

  updateProfileInfo = () => {
    const toSend = {};

    if ((this.state.newFirstName !== '') && (this.state.newFirstName !== this.state.originalUserInfo.first_name)) {
      toSend.first_name = this.state.newFirstName;
    }

    if ((this.state.newLastName !== '') && (this.state.newLastName !== this.state.originalUserInfo.last_name)) {
      toSend.last_name = this.state.newLastName;
    }

    if ((this.state.newEmail !== '') && (this.state.newEmail !== this.state.originalUserInfo.email)) {
      toSend.email = this.state.newEmail;
    }

    if (this.state.newPassword !== '') {
      toSend.password = this.state.newPassword;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.loginInfo.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': `${this.state.loginInfo.token}`,
      },
      body: JSON.stringify(toSend),
    })
      .then(() => {
        console.log('Item updated');
      })
      .then(() => this.loadUserDetails())
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.userInfoSection}>
          <Image
            source={{ uri: this.state.profileImage }}
            style={{ width: '45%', height: 150 }}
          />
          <Text style={Styles.profileName}>
            {this.state.originalUserInfo.first_name}
          </Text>
          <Text style={Styles.profileName}>
            {this.state.originalUserInfo.last_name}
          </Text>
        </View>

        <View style={Styles.editProfileSection}>
          <Button
            title="Edit Profile"
            color="#1f63ab"
            onPress={() => this.editProfile()}
          />

          <View style={{ display: this.state.showEditProfile ? 'flex' : 'none' }}>
            <TextInput
              placeholder={this.state.originalUserInfo.email}
              onChangeText={(email) => {
                this.setState({ newEmail: email });
              }}
              value={this.state.newEmail}
            />
            <TextInput
              placeholder={this.state.originalUserInfo.first_name}
              onChangeText={(firstName) => {
                this.setState({ newFirstName: firstName });
              }}
              value={this.state.newFirstName}
            />
            <TextInput
              placeholder={this.state.originalUserInfo.last_name}
              onChangeText={(lastName) => {
                this.setState({ newLastName: lastName });
              }}
              value={this.state.newLastName}
            />
            <TextInput
              placeholder="Enter New Password"
              onChangeText={(password) => {
                this.setState({ newPassword: password });
              }}
              value={this.state.newPassword}
            />
            <Button
              title="Update Profile Picture"
              color="#1f63ab"
              onPress={() => this.props.navigation.navigate('ProfileCamera')}
            />
            <Button
              title="Update"
              color="#1f63ab"
              onPress={() => this.updateProfileInfo()}
            />
          </View>
        </View>
        <View style={Styles.userPostsSection}>
          <Text style={Styles.title}>Add a new post</Text>
          <TextInput
            placeholder="What are you thinking?"
            onChangeText={(text) => {
              this.setState({ newPostText: text });
            }}
            value={this.state.newPostText}
          />
          <Button
            title="Add"
            color="#1f63ab"
            onPress={() => this.addNewPost()}
          />

          <Text style={Styles.title}>
            Posts:
          </Text>
          <ScrollView>
            <FlatList
              data={this.state.userPosts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={Styles.userPostsItem}
                  onPress={() => {
                    this.props.navigation.navigate(
                      'Post',
                      {
                        postId: item.post_id,
                        userId: this.state.loginInfo.id,
                      },
                    );
                  }}
                >
                  <Text style={Styles.userPostContent}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default ProfileScreen;
