import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePickerLib from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ImageAsset } from '../types';

interface ImagePickerProps {
  onImagesSelected: (images: ImageAsset[]) => void;
  selectedImages: ImageAsset[];
  disabled?: boolean;
}

export default function ImagePicker({ onImagesSelected, selectedImages, disabled }: ImagePickerProps) {
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
        onImagesSelected([...selectedImages, ...images]);
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
        onImagesSelected([...selectedImages, image]);
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
        onImagesSelected([...selectedImages, ...images]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick files');
      console.error('File picker error:', error);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    onImagesSelected(newImages);
  };

  const clearAllImages = () => {
    Alert.alert(
      'Clear All Images',
      'Are you sure you want to remove all selected images?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => onImagesSelected([]) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Images</Text>
        {selectedImages.length > 0 && (
          <TouchableOpacity onPress={clearAllImages} disabled={disabled}>
            <Text style={[styles.clearText, disabled && styles.clearTextDisabled]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
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

      {selectedImages.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>
            Selected Images ({selectedImages.length})
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.previewScroll}
          >
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.previewItem}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                  disabled={disabled}
                >
                  <Ionicons name="close-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
                <Text style={styles.fileName} numberOfLines={1}>
                  {image.fileName}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearText: {
    color: '#ff4444',
    fontSize: 14,
    fontWeight: '600',
  },
  clearTextDisabled: {
    color: '#999',
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
  previewContainer: {
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  previewScroll: {
    flexDirection: 'row',
  },
  previewItem: {
    marginRight: 12,
    alignItems: 'center',
    width: 100,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#3a3a3a',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  fileName: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
    width: 80,
  },
});

