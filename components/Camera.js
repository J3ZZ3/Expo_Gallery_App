import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // Import Location API
import { insertMedia } from './Database'; // Import the database functions

export default function Camera({ onMediaSaved }) {
  const navigation = useNavigation();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef(null);

  // Check if permission is still loading
  if (permission === null) {
    return <View />; // or a loading indicator
  }

  // Check if permission is granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }
   const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePictureAsync();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const metadata = {
          timestamp: new Date().toISOString(),
          geolocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          uri: photo.uri,
        };
        await saveMedia(metadata); // Save metadata along with the image
        onMediaSaved(); // Notify that media has been saved
      } else {
        Alert.alert("Permission to access location was denied");
      }
    }
  };
   
   const saveMedia = async (metadata) => {
    try {
      await insertMedia(metadata.uri, metadata.timestamp, metadata.geolocation.latitude, metadata.geolocation.longitude);
      Alert.alert("Photo saved!", `Location: ${metadata.geolocation.latitude}, ${metadata.geolocation.longitude}`);
    } catch (error) {
      console.error("Error saving media:", error);
    }
  };

  const openGallery = () => {
    navigation.navigate('gallery');
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={camera}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
            <Text style={styles.text}><Ionicons name="camera-reverse" size={60} color="white" /></Text>
          </Pressable>
          <Pressable 
            style={styles.captureButton} 
            onPress={takePicture}
          >
            <View style={styles.capture}>
              <Ionicons name="camera" size={60} color="white" />
            </View>
          </Pressable>
          <Pressable style={styles.galleryButton} onPress={openGallery}>
            <Ionicons name="images" size={60} color="white" />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    top: 680,
  },
  button: {
    alignItems: 'center',
  },
  captureButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20, // Add some space between buttons
  },
  capture: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
}); 