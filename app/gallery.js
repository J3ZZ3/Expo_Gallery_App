import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, ImageBackground } from 'react-native';
import { fetchMedia } from '../components/Database';
import { useRouter } from 'expo-router';

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
       uri: item.uri,
       latitude: item.latitude,
       longitude: item.longitude,
       timestamp: item.timestamp
     }
   });
 };
  const renderItem = ({ item }) => {
   return (
     <TouchableOpacity onPress={() => handleImagePress(item)} style={styles.itemContainer}>
       {item.uri.endsWith('.mp4') ? (
         <View style={styles.videoContainer}>
           <Image source={{ uri: item.uri }} style={styles.image} />
           <View style={styles.videoOverlay}>
             <Text style={styles.playIcon}>▶️</Text>
           </View>
         </View>
       ) : (
         <Image source={{ uri: item.uri }} style={styles.image} />
       )}
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
 }
});


export default Gallery;