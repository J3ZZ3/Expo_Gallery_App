import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchMedia } from './Database';

const Map = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetchMedia(setMedia);
  }, []);

  return (
    <MapView style={{ flex: 1 }}>
      {media.map(item => (
        <Marker
          key={item.id}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          title={`Photo taken at ${item.timestamp}`}
        />
      ))}
    </MapView>
  );
};

export default Map; 