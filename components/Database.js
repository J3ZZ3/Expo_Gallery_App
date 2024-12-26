import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDIA_KEY = 'media'; 

export const init = async () => {
  try {
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify([]));
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const insertMedia = async (uri, timestamp, latitude, longitude, city) => {
  try {
    const existingMedia = await AsyncStorage.getItem(MEDIA_KEY);
    const media = existingMedia ? JSON.parse(existingMedia) : [];
    media.push({ uri, timestamp, latitude, longitude, city });
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(media));
  } catch (error) {
    console.error("Error saving media:", error);
  }
};

export const fetchMedia = async (callback) => {
  try {
    const existingMedia = await AsyncStorage.getItem(MEDIA_KEY);
    const media = existingMedia ? JSON.parse(existingMedia) : [];
    callback(media);
  } catch (error) {
    console.error("Error fetching media:", error);
  }
};

export const deleteMedia = async (uri) => {
  try {
    const existingMedia = await AsyncStorage.getItem(MEDIA_KEY);
    const media = existingMedia ? JSON.parse(existingMedia) : [];
    
    const updatedMedia = media.filter(item => item.uri !== uri);
    
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(updatedMedia));
  } catch (error) {
    console.error("Error deleting media:", error);
  }
};
