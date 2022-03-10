/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem,
} from '@react-navigation/drawer';
import LoginScreen from './components/login';
import LogoutScreen from './components/logout';
import SignUpScreen from './components/sign-up';
import ProfileScreen from './components/profile';
import FriendsScreen from './components/friends';
import SearchScreen from './components/search';
import UserProfileScreen from './components/user-profile';
import ProfileCamera from './components/profile-camera';
import PostScreen from './components/post';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: '#1f63ab',
    background: '#1f63ab',
    card: '#7da2c9',
    text: 'rgb(255, 255, 255)',
    border: '#7da2c9',
    notification: '#7da2c9',
  },
};

class App extends Component {
  CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={() => props.navigation.navigate('Logout')}
      />
    </DrawerContentScrollView>
  );

  Main = () => (
    <Drawer.Navigator drawerContent={(props) => this.CustomDrawerContent(props)}>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="Friends" component={FriendsScreen} />
    </Drawer.Navigator>
  );

  render() {
    return (
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="ProfileCamera" component={ProfileCamera} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="Main" component={this.Main} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
