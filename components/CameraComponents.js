import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
      import { useRef, useState } from 'react';
      import { Button, StyleSheet, Text, Pressable, View,Dimensions,Image} from 'react-native';
      import { Ionicons, MaterialIcons } from '@expo/vector-icons';
      
      export default function CameraComponent() {
        const [facing, setFacing] = useState('back');
        const [permission, requestPermission] = useCameraPermissions();
        const [picture, setPic] = useState('');
        const camera = useRef('')
      
        if (!permission) {
          // Camera permissions are still loading.
          return <View />;
        }
      
        if (!permission.granted) {
          // Camera permissions are not granted yet.
          return (
            <View style={styles.container}>
              <Text style={styles.message}>We need your permission to show the camera</Text>
              <Button onPress={requestPermission} title="grant permission" />
            </View>
          );
        }

        const takePicture = async () => {
          const options = {
            base64: true,
            exif: false,
            quality: 1
          }

          const pic = await camera.current.takePictureAsync(options);
          setPic(pic);
        }

        function toggleCameraFacing() {
          setFacing(current => (current === 'back' ? 'front' : 'back'));
        }
        const sendPic = () => {
          
        }
        if (picture) {
          return (
            <View style={styles.imgCont}>
              <Image style={styles.image} source={{ uri: `data:image/jpg;base64,${picture.base64}` }} />
              <Pressable style={styles.sendCont} onPress={() => sendPic()}>
                <MaterialIcons name="send" size={30} style={styles.sendIcon} />
              </Pressable>
            </View>
          );
        }
      
        return (
          <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={camera}>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={toggleCameraFacing}>
                  <Text style={styles.text}><Ionicons name="camera-reverse" size={60} color="white" /></Text>
                </Pressable>
                <View style={styles.bottom}>
                    <Pressable onPress={() => takePicture()}>
                        <View style={styles.capture} />
                    </Pressable>
                </View>
              </View>
            </CameraView>
          </View>
        );
      }
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
        },
        message: {
          textAlign: 'center',
          paddingBottom: 10,
        },
        camera: {
          flex: 1,
        },
        buttonContainer: {
          flex: 1,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          margin: 64,
        },
        button: {
          flex: 1,
          alignSelf: 'flex-end',
          alignItems: 'center',
        },
        text: {
          fontSize: 24,
          fontWeight: 'bold',
          color: 'white',
          right: 50,
        },
        bottom: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 80,
        },
        capture: {
            borderColor: 'white',
            borderWidth: 3,
            borderRadius: 30,
            width: 60,
            height: 60,
            top: 580,
            left: 0,
            right: 0,
            bottom: 0,
        },
        imgCont: {
            flex: 1,
        },
        image: {
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
        },
        sendCont: {
            position: 'absolute',
            right: 0,
            bottom: 20,
            backgroundColor: '#grey',
            height: 60,
            width: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        sendIcon: {
            color: 'white',
            marginLeft: 5,
        }
      });
      