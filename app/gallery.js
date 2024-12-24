import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, ImageBackground, Alert } from 'react-native';
import { fetchMedia, deleteMedia } from '../components/Database';  // Import deleteMedia function
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';  // Import the Icon component



const Gallery = () => {
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setRefreshing(true);
    fetchMedia((fetchedMedia) => {
      setMedia(fetchedMedia);
      setRefreshing(false);
    });
  };

  const onRefresh = () => {
    loadMedia();
  };

  const handleImagePress = (item) => {
    router.push({
      pathname: '/imageView',
      params: {
        uri: encodeURI(item.uri), // Ensure the URI is properly encoded
        latitude: item.latitude,
        longitude: item.longitude,
        timestamp: item.timestamp,
      },
    });
  };
  

  const deleteImage = async (uri) => {
    try {
      // Confirm deletion
      Alert.alert(
        "Delete Image",
        "Are you sure you want to delete this image?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: async () => {
              // Call the delete function from Database.js
              await deleteMedia(uri);  // Use the deleteMedia function to delete from AsyncStorage
              setMedia(prevMedia => prevMedia.filter(item => item.uri !== uri));  // Update state to remove deleted item
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleImagePress(item)} style={styles.itemContainer}>
        <TouchableOpacity onPress={() => deleteImage(item.uri)} style={styles.deleteButton}>
          <Icon name="trash" size={30} color="white" /> 
        </TouchableOpacity>
        <Image source={{ uri: item.uri }} style={styles.image} />
      </TouchableOpacity>
    );
  };
  
  return (
    <ImageBackground source={require('../assets/images/camera.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={media}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 10,
    top: 40,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  videoContainer: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playIcon: {
    fontSize: 24,
    color: 'white',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
  },
});

export default Gallery;
