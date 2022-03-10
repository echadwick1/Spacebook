/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getLoginDetails } from './helpers';

const Styles = StyleSheet.create({
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
  },
  userContent: {
    fontSize: 22,
    padding: 5,
  },
  button: {
    paddingBottom: 5,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  pageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchMethod: '',
      loginInfo: {},
      searchResults: [],
      pageOffset: 0,
      disableBackButton: false,
      disableNextButton: false,
    };
  }

  async componentDidMount() {
    const data = await getLoginDetails();

    this.setState({
      loginInfo: data,
    });

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  search = () => {
    fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.searchTerm}&search_in=${this.state.searchMethod}&limit=7&offset=${this.state.pageOffset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `${this.state.loginInfo.token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => this.setState({ searchResults: json }));
  };

  previousPage = () => {
    const Offset = this.state.pageOffset;

    if (Offset <= 0) {
      this.setState({ disableBackButton: true });
    } else if (Offset > 0) {
      this.setState({ disableNextButton: false });
      this.setState({
        pageOffset: Offset - 7,
      }, () => this.search());
    }
    console.log(this.state.pageOffset);
  };

  nextPage = () => {
    const Offset = this.state.pageOffset;
    if (this.state.searchResults.length < 7 && Offset >= 0) {
      this.setState({ disableNextButton: true });
    } else if (Offset <= 0) {
      this.setState({ disableBackButton: false });
      this.setState({
        pageOffset: Offset + 7,
      }, () => {
        this.search();
        this.setState({ disableNextButton: false });
      });
    }
    console.log(this.state.pageOffset);
  };

  checkLoggedIn = async () => {
    const data = await getLoginDetails();
    if (data == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={Styles.userSection}>
        <TextInput
          placeholder="Search for a user"
          onChangeText={(searchTerm) => this.setState({ searchTerm })}
          value={this.state.searchTerm}
        />
        <View style={Styles.button}>
          <Button
            title="Search All Users"
            onPress={() => {
              this.setState({ searchMethod: 'all' }, () => this.search());
            }}
          />
        </View>
        <View style={Styles.button}>
          <Button
            title="Search Friends Only "
            onPress={() => {
              this.setState({ searchMethod: 'friends' }, () => this.search());
            }}
          />
        </View>

        <FlatList
          data={this.state.searchResults}
          renderItem={({ item }) => (
            <View style={Styles.userItem}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate(
                  'UserProfile',
                  {
                    item,
                  },
                )}
              >
                <Text style={Styles.userContent}>{item.user_givenname}</Text>
                <Text style={Styles.userContent}>{item.user_familyname}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={Styles.pageButtons}>
          <Button
            title="Back"
            disabled={this.state.disableBackButton}
            onPress={() => this.previousPage()}
          />
          <Button
            title="Next Page"
            disabled={this.state.disableNextButton}
            onPress={() => this.nextPage()}
          />
        </View>
      </View>
    );
  }
}

export default SearchScreen;
