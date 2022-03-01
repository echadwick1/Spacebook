import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { getLoginDetails } from './helpers';

class ProfileCamera extends Component{
  constructor(props){
    super(props);

    this.state = {
      loginInfo: {},
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount() {
    const data = await getLoginDetails();
    const { status } = await Camera.requestCameraPermissionsAsync();

    this.setState({
        loginInfo: data,
        hasPermission: status === 'granted'
    });

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount(){
    this._unsubscribe();
  }

  checkLoggedIn = async () => {
    let data = await getLoginDetails();
    if (data.token == null) {
        this.props.navigation.navigate('Login');
    }
  };

  sendToServer = async (data) => {
    let details = await getLoginDetails();
    let token = details.token;
    let id = details.id;

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
        method: "POST",
        headers: {
            "Content-Type": "image/png",
            "X-Authorization": token
        },
        body: blob
    })
    .then((response) => {
        console.log("Picture added", response);
    })
    .catch((err) => {
        console.log(err);
    })
  } 

  takePicture = async () => {
    if(this.camera){
        const options = {
            quality: 0.5, 
            base64: true,
            onPictureSaved: (data) => this.sendToServer(data)
        };
        await this.camera.takePictureAsync(options); 
    } 
  }

  render(){
    if(this.state.hasPermission){
      return (
        <View style={styles.container}>
        <Camera 
          style={styles.camera} 
          type={this.state.type} 
          ref={ref => this.camera = ref}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.takePicture()}>
              <Text> TakePhoto </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      );
    }
    else {
      return(
        <Text>No access to camera</Text>
      );
    }
  }
}

export default ProfileCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});