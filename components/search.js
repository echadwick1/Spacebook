import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { getLoginDetails } from './helpers';

class SearchScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            searchTerm: "",
            loginInfo: {},
            searchResults: []
        }
    }

    async componentDidMount() {
        const data = await getLoginDetails();

        this.setState({
            loginInfo: data
        });

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    search = (searchMethod) => {
        fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.searchTerm}&search_in=${searchMethod}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `${this.state.loginInfo.token}`,
            },
        })
        .then((response) => response.json())
        .then((json) => 
            this.setState({searchResults: json})
        )
    }

    checkLoggedIn = async () => {
        let data = await getLoginDetails();
        if (data == null) {
            this.props.navigation.navigate('Login');
        }
    };

    render(){
        return (
            <View>
                <TextInput
                    placeholder="Search for a user"
                    onChangeText={(searchTerm) => this.setState({searchTerm})}
                    value={this.state.searchTerm}
                />
                <Button
                    title="Search All Users"
                    onPress={() => this.search("all")}
                />
                <Button
                    title="Search Friends Only "
                    onPress={() => this.search("friends")}
                />

                <FlatList
                    data={this.state.searchResults}
                    renderItem={({item, index}) => 
                        <View>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('UserProfile', 
                                {
                                    item: item 
                                }
                                )}>
                                <Text>{item.user_givenname}</Text>
                                <Text>{item.user_familyname}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
        );
    }
}

export default SearchScreen;