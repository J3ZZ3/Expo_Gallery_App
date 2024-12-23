import React from 'react';
import { View, Image, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Map from '../components/Map';
import { Ionicons } from '@expo/vector-icons';
import { deleteMedia } from '../components/Database';


export default function ImageView() {
 const { uri, latitude, longitude, timestamp } = useLocalSearchParams();
 const router = useRouter();
  const handleDelete = async () => {
   Alert.alert(
     "Delete Image",
     "Are you sure you want to delete this image?",
     [
       { text: "Cancel", style: "cancel" },
       { 
         text: "Delete", 
         style: "destructive",
         onPress: async () => {
           await deleteMedia(uri);
           router.back();
         }
       }
     ]
   );
 };
  const formattedDate = new Date(timestamp).toLocaleString();
 const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  return (
   <View style={styles.container}>
     <Image source={{ uri }} style={styles.image} />
     
     <View style={styles.detailsContainer}>
       <Text style={styles.detailsText}>Date: {formattedDate}</Text>
       <Text style={styles.detailsText}>
         Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
       </Text>
     </View>
      <View style={styles.mapContainer}>
       <Map location={location} />
     </View>
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
       <Ionicons name="trash" size={24} color="white" />
       <Text style={styles.buttonText}>Delete Image</Text>
     </Pressable>
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: 'black',
 },
 image: {
   width: '100%',
   height: '50%',
   resizeMode: 'contain',
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