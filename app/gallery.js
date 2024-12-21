import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, RefreshControl, Modal, Pressable, ImageBackground } from 'react-native';
import { fetchMedia } from '../components/Database'; // Import the database functions
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the close icon

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedImageUri, setSelectedImageUri] = useState(null); // State for selected image URI

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setRefreshing(true); // Set refreshing to true
    fetchMedia((fetchedMedia) => {
      setMedia(fetchedMedia);
      setRefreshing(false); // Set refreshing to false after loading
    });
  };

  const onRefresh = () => {
    loadMedia(); // Call loadMedia to refresh the gallery
  };

  

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleImagePress(item.uri)} style={styles.itemContainer}>
        {item.uri.endsWith('.mp4') ? ( // Check if the item is a video
          <View style={styles.videoContainer}>
            <Text style={styles.videoOverlay}>▶️</Text>
            <Image source={{ uri: item.uri }} style={styles.image} />
          </View>
        ) : (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
      </TouchableOpacity>
    );
  };

  const handleImagePress = (uri) => {
    setSelectedImageUri(uri); // Set the selected image URI
    setModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
    setSelectedImageUri(null); // Clear the selected image URI
  };

  return (
    <ImageBackground source={require('../assets/images/camera.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={media}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          numColumns={3} // Display items in 3 columns
          columnWrapperStyle={styles.row} // Style for the row
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Attach RefreshControl
          }
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImageUri }} style={styles.fullScreenImage} />
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close" size={30} color="white" /> 
            </Pressable>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Cover the entire screen
  },
  container: {
    flex: 1,
    padding: 10,
    top: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Darker text color for contrast
    marginBottom: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10, // Rounded corners
    overflow: 'hidden', // Ensure the image respects the border radius
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10, // Rounded corners
    resizeMode: 'cover', // Cover the entire area
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Maintain aspect ratio
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 10,
    borderRadius: 5,
  },
});

export default Gallery;