import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchMedia } from './Database';

const Map = ({ location }) => {
  if (!location) return null; // Return null if no location is provided

  return (
    <MapView style={{ flex: 1 }}>
      <Marker
        coordinate={location}
        title={`Photo taken at ${location.latitude}, ${location.longitude}`}
      />
    </MapView>
  );
};

export default Map; 