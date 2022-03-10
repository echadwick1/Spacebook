/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet,
} from 'react-native';
import { getLoginDetails } from './helpers';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f63ab',
  },
  userSection: {
    padding: 10,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#7da2c9',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  userItem: {
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    height: 75,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  userContent: {
    fontSize: 22,
    padding: 5,
  },
  title: {
    fontSize: 24,
    paddingBottom: 5,
  },
  pageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friendRequests: [],
      friends: [],
      loggedInUserInfo: {},
    };
  }

  async componentDidMount() {
    const data = await getLoginDetails();
    this.setState({
      loggedInUserInfo: data,
    });

    this.getMyFriendRequests();
    this.getMyFriends();

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  checkLoggedIn = async () => {
    const data = await getLoginDetails();
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
      .then((json) => this.setState({ friends: json }))
      .catch((error) => {
        console.error(error);
      });
  };

  getMyFriendRequests = () => {
    fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `${this.state.loggedInUserInfo.token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => this.setState({ friendRequests: json }))
      .catch((error) => {
        console.error(error);
      });
  };

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
      });
  };

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
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userSection}>
          <Text style={styles.title}>Outstanding Friend Requests:</Text>

          <FlatList
            data={this.state.friendRequests}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userContent}>{item.first_name}</Text>
                <Text style={styles.userContent}>{item.last_name}</Text>
                <View style={styles.pageButtons}>
                  <Button
                    title="Accept"
                    onPress={() => this.acceptFriendRequest(item.user_id)}
                  />
                  <Button
                    title="Reject"
                    onPress={() => this.rejectFriendRequest(item.user_id)}
                  />
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.userSection}>
          <Text style={styles.title}>My Friends:</Text>

          <FlatList
            data={this.state.friends}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userContent}>{item.user_givenname}</Text>
                <Text style={styles.userContent}>{item.user_familyname}</Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

export default FriendsScreen;
