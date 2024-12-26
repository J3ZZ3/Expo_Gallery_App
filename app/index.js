import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { init, insertMedia } from '../components/Database';

export default function CameraScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef(null);

  useEffect(() => {
    init();
  }, []);

  if (permission === null) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const getCityName = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const { city, region } = geocode[0];
        return city || region || 'Unknown Location';
      }
    } catch (error) {
      console.error('Error fetching city name:', error);
    }
    return 'Unknown Location';
  };

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePictureAsync();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const cityName = await getCityName(location.coords.latitude, location.coords.longitude);

        const metadata = {
          timestamp: new Date().toISOString(),
          geolocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            city: cityName,
          },
          uri: photo.uri,
        };

        await saveMedia(metadata);
      } else {
        Alert.alert('Permission to access location was denied');
      }
    }
  };

  const saveMedia = async (metadata) => {
    try {
      await insertMedia(
        metadata.uri,
        metadata.timestamp,
        metadata.geolocation.latitude,
        metadata.geolocation.longitude,
        metadata.geolocation.city
      );

      Alert.alert(
        'Photo saved!',
        `City: ${metadata.geolocation.city}\nDate: ${new Date(metadata.timestamp).toLocaleString()}`
      );
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  const openGallery = () => {
    router.push('/gallery');
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
    marginLeft: 20,
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