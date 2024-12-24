import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

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

const Map = ({ location }) => {
  const [city, setCity] = useState('');

  useEffect(() => {
    if (location) {
      getCityName(location.latitude, location.longitude).then(setCity);
    }
  }, [location]);

  if (!location) return <Text>Location not provided</Text>;

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        <Marker
          coordinate={location}
          title={`Closest city: ${city}`}
          description={`Coordinates: ${location.latitude}, ${location.longitude}`}
        />
      </MapView>
    </View>
  );
};

export default Map;
