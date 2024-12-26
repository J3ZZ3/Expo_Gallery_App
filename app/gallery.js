import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, ImageBackground, Alert, TextInput, Button, Modal, Text } from 'react-native';
import { fetchMedia, deleteMedia } from '../components/Database';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const Gallery = () => {
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, startDate, endDate, media]);

  const loadMedia = async () => {
    setRefreshing(true);
    fetchMedia((fetchedMedia) => {
      setMedia(fetchedMedia);
      setRefreshing(false);
    });
  };

  const applyFilters = () => {
    let filtered = media;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= start && itemDate <= end;
      });
    }

    setFilteredMedia(filtered);
  };

  const onRefresh = () => {
    loadMedia();
  };

  const handleImagePress = (item) => {
    router.push({
      pathname: '/imageView',
      params: {
        uri: encodeURI(item.uri),
        latitude: item.latitude,
        longitude: item.longitude,
        timestamp: item.timestamp,
      },
    });
  };

  const deleteImage = async (uri) => {
    try {
      Alert.alert(
        "Delete Image",
        "Are you sure you want to delete this image?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: async () => {
              await deleteMedia(uri);
              setMedia((prevMedia) => prevMedia.filter((item) => item.uri !== uri));
            },
          },
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
        {}
        <TextInput
          style={styles.searchBar}
          placeholder="Search by City"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        {}
        <Button title="Filter by Date Range" onPress={() => setModalVisible(true)} />

        {}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter by Date Range</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="Start Date (YYYY-MM-DD)"
                placeholderTextColor="gray"
                value={startDate}
                onChangeText={(text) => setStartDate(text)}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="End Date (YYYY-MM-DD)"
                placeholderTextColor="gray"
                value={endDate}
                onChangeText={(text) => setEndDate(text)}
              />
              <View style={styles.modalButtons}>
                <Button title="Apply" onPress={applyFilters} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
              </View>
            </View>
          </View>
        </Modal>

        {}
        <FlatList
          data={filteredMedia}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  dateInput: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Gallery;
