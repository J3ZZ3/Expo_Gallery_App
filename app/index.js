import React, { useEffect } from 'react';
import { init } from '../components/Database'; // Adjust the path as necessary
import Camera from '../components/Camera';

export default function CameraScreen() {
  useEffect(() => {
    init(); // Initialize the database
  }, []);

  return <Camera />;
} 