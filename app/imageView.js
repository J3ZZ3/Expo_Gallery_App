import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Map from '../components/Map';
import { Ionicons } from '@expo/vector-icons';
import { deleteMedia } from '../components/Database';
import * as Location from 'expo-location';

export default function ImageView() {
  const { uri, latitude, longitude, timestamp, id } = useLocalSearchParams();
  const [city, setCity] = useState(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCityName = async () => {
      if (latitude && longitude) {
        try {
          const geocode = await Location.reverseGeocodeAsync({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          });
          if (geocode.length > 0) {
            const { city, region } = geocode[0];
            setCity(city || region || 'Unknown Location');
          } else {
            setCity('Unknown Location');
          }
        } catch (error) {
          console.error('Error fetching city name:', error);
          setCity('Unknown Location');
        }
      }
    };

    getCityName();
  }, [latitude, longitude]);

  const checkImageURI = async (imageUri) => {
    try {
      const response = await fetch(imageUri, { method: 'HEAD' });
      if (response.ok) {
        setImageError(false);
      } else {
        setImageError(true);
      }
    } catch (error) {
      setImageError(true);
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    if (uri) {
      checkImageURI(uri);
    }
  }, [uri]);

  const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'Unknown Date';

  const location = {
    latitude: latitude ? parseFloat(latitude) : 0,
    longitude: longitude ? parseFloat(longitude) : 0,
  };

  const handleDelete = async () => {
    try {
      await deleteMedia(uri);
      Alert.alert('Image deleted successfully');
      router.push('/gallery');
    } catch (error) {
      console.error('Error deleting image:', error);
      Alert.alert('Error deleting image');
    }
  };

  return (
    <View style={styles.container}>
      {}
      <Image
        source={uri ? { uri } : require('../assets/images/placeholder.jpg')}
        style={styles.image}
        onError={(error) => {
          console.error('Error loading image:', error.nativeEvent.error);
          setImageError(true);
        }}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Date: {formattedDate}</Text>
        <Text style={styles.detailsText}>
          Location: {city || 'Fetching location...'}
        </Text>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={24} color="white" />
          <Text style={styles.buttonText}>Delete Image</Text>
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <Map location={location} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: '#222',
  },
  detailsText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  mapContainer: {
    height: '25%',
    margin: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 15,
    margin: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});
