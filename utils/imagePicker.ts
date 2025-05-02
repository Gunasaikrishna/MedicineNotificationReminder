import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const pickImage = async () => {
  // Request permission first
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return null;
  }

  // No permissions request is necessary for launching the image library
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

export const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Sorry, we need camera permissions to make this work!');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};