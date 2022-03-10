/* eslint-disable linebreak-style */
import AsyncStorage from '@react-native-async-storage/async-storage';

const getLoginDetails = async () => {
  try {
    const json = await AsyncStorage.getItem('@spacebook_details');
    const data = JSON.parse(json);
    return data;
  } catch (e) {
    console.error(e);
  }
};

const storeLoginDetails = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@spacebook_details', jsonValue);
  } catch (e) {
    console.error(e);
  }
};

const removeLoginDetails = async () => {
  try {
    await AsyncStorage.removeItem('@spacebook_details');
  } catch (e) {
    console.error(e);
  }
};

export {
  getLoginDetails,
  storeLoginDetails,
  removeLoginDetails,
};
