import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePickerLib from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ImageAsset } from '../types';

interface ImagePickerProps {
  onImagesSelected: (images: ImageAsset[]) => void;
  disabled?: boolean;
}

export default function ImagePicker({ onImagesSelected, disabled }: ImagePickerProps) {
  const requestPermissions = async () => {
    const { status } = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select images!'
      );
      return false;
    }
    return true;
  };

  const pickFromGallery = async () => {
    if (disabled) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePickerLib.launchImageLibraryAsync({
        mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const images: ImageAsset[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          fileName: asset.fileName || `image_${index}.jpg`,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
        }));
        onImagesSelected(images);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images from gallery');
      console.error('Gallery picker error:', error);
    }
  };

  const pickFromCamera = async () => {
    if (disabled) return;

    const { status } = await ImagePickerLib.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos!'
      );
      return;
    }

    try {
      const result = await ImagePickerLib.launchCameraAsync({
        mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const image: ImageAsset = {
          uri: asset.uri,
          fileName: asset.fileName || `camera_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
        };
        onImagesSelected([image]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error('Camera error:', error);
    }
  };

  const pickFromFiles = async () => {
    if (disabled) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const images: ImageAsset[] = result.assets.map((asset) => ({
          uri: asset.uri,
          fileName: asset.name,
          type: asset.mimeType || 'image/jpeg',
          size: asset.size || 0,
        }));
        onImagesSelected(images);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick files');
      console.error('File picker error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Images</Text>
      <Text style={styles.subtitle}>
        Choose manga images to colorize using AI
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={pickFromGallery}
          disabled={disabled}
        >
          <Ionicons name="images-outline" size={24} color={disabled ? '#999' : '#007AFF'} />
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={pickFromCamera}
          disabled={disabled}
        >
          <Ionicons name="camera-outline" size={24} color={disabled ? '#999' : '#007AFF'} />
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={pickFromFiles}
          disabled={disabled}
        >
          <Ionicons name="folder-outline" size={24} color={disabled ? '#999' : '#007AFF'} />
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            Files
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#3a3a3a',
    minWidth: 80,
  },
  buttonDisabled: {
    backgroundColor: '#1a1a1a',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  buttonTextDisabled: {
    color: '#999',
  },
});

