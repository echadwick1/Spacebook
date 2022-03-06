import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';

import LoginScreen from './components/login';
import LogoutScreen from './components/logout';
import SignUpScreen from './components/sign-up';
import ProfileScreen from './components/profile';
import FriendsScreen from './components/friends';
import SearchScreen from './components/search';
import UserProfileScreen from './components/user-profile.js';
import ProfileCamera from './components/profile-camera.js';
import PostScreen from './components/post.js';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from "@react-navigation/drawer"

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

class App extends Component {
  constructor (props) {
    super(props);
  }

  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="ProfileCamera" component={ProfileCamera} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="Main" component={this.Main} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  Main = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => this.CustomDrawerContent(props)}>
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="Search" component={SearchScreen} />
          <Drawer.Screen name="Friends" component={FriendsScreen} />
        </Drawer.Navigator>
    );
  }
  
  CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem 
          label="Sign Out"
          onPress={() => props.navigation.navigate("Logout")}
        />
      </DrawerContentScrollView>
    );
  }
}

export default App;
