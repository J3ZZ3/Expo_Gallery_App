import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="gallery" options={{ headerShown: false }} />
      <Stack.Screen 
       name="imageView" 
       options={{ 
         headerShown: true,
         headerTitle: 'Image Details',
         headerStyle: { backgroundColor: 'black' },
         headerTintColor: 'white'
       }} 
     />
    </Stack>
  );
}
