import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './components/login';
import SignUpScreen from './components/sign-up';
import ProfileScreen from './components/profile';
import FriendsScreen from './components/friends';
import SearchScreen from './components/search';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from "@react-navigation/drawer"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Main() {
  return (
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="Friends" component={FriendsScreen} />
      </Drawer.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem 
        label="Sign Out"
        onPress={() => SignOut(props)}
      />
    </DrawerContentScrollView>
  );
}

async function SignOut(props) {
  let token = await AsyncStorage.getItem('@spacebook_details');
  await AsyncStorage.removeItem('@spacebook_details');
  const data = JSON.parse(token);
  return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: 'POST',
      headers: {
          "X-Authorization": data.token
      }
  })
  .then((response) => {
      if(response.status === 200){
          props.navigation.navigate("Login");
      }else if(response.status === 401){
          props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .catch((error) => {
      console.log(error);
  })
}

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Main" component={Main} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
