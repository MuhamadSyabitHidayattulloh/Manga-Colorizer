import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { ProcessingSettings, ProcessedImage, ImageAsset } from '../types';
import { ApiService } from '../utils/api';
import { StorageService } from '../utils/storage';

interface ImageProcessorProps {
  apiUrl: string;
  images: ImageAsset[];
  settings: ProcessingSettings;
  onImagesProcessed: (images: ProcessedImage[]) => void;
  onProcessingStateChange: (processing: boolean) => void;
}

export default function ImageProcessor({
  apiUrl,
  images,
  settings,
  onImagesProcessed,
  onProcessingStateChange,
}: ImageProcessorProps) {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [currentProcessing, setCurrentProcessing] = useState<number>(-1);
  const [progress, setProgress] = useState(0);
  const [showOriginal, setShowOriginal] = useState<{ [key: number]: boolean }>({});

  const processImages = async () => {
    if (!apiUrl || images.length === 0) {
      Alert.alert('Error', 'Please select images and configure API URL');
      return;
    }

    onProcessingStateChange(true);
    setProgress(0);
    setProcessedImages([]);

    const apiService = new ApiService(apiUrl);
    const results: ProcessedImage[] = [];

    for (let i = 0; i < images.length; i++) {
      setCurrentProcessing(i);
      
      try {
        const startTime = Date.now();
        const processedUri = await apiService.processImage(images[i].uri, settings);
        const processingTime = Date.now() - startTime;

        const processedImage: ProcessedImage = {
          id: Date.now() + i,
          originalUri: images[i].uri,
          processedUri,
          error: null,
          processingTime,
          fileName: images[i].fileName,
        };

        results.push(processedImage);
        setProcessedImages([...results]);
        
        // Save to history
        await StorageService.addToProcessingHistory(processedImage);
        
      } catch (error) {
        const processedImage: ProcessedImage = {
          id: Date.now() + i,
          originalUri: images[i].uri,
          processedUri: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          processingTime: 0,
          fileName: images[i].fileName,
        };
        
        results.push(processedImage);
        setProcessedImages([...results]);
      }

      setProgress(((i + 1) / images.length) * 100);
    }

    setCurrentProcessing(-1);
    onProcessingStateChange(false);
    onImagesProcessed(results);
  };

  const saveToGallery = async (imageUri: string, fileName: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save images to gallery');
        return;
      }

      // Download the image to a temporary file
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.downloadAsync(imageUri, fileUri);
      
      // Save to media library
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert('Success', 'Image saved to gallery!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image to gallery');
      console.error('Save error:', error);
    }
  };

  const shareImage = async (imageUri: string) => {
    try {
      await Share.share({
        url: imageUri,
        message: 'Check out this colorized manga image!',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share image');
      console.error('Share error:', error);
    }
  };

  const toggleFavorite = async (image: ProcessedImage) => {
    try {
      const isFav = await StorageService.isFavorite(image.id);
      if (isFav) {
        await StorageService.removeFromFavorites(image.id);
        Alert.alert('Removed', 'Image removed from favorites');
      } else {
        await StorageService.addToFavorites(image);
        Alert.alert('Added', 'Image added to favorites');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const toggleView = (imageId: number) => {
    setShowOriginal(prev => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  };

  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={64} color="#666" />
        <Text style={styles.emptyText}>No images selected</Text>
        <Text style={styles.emptySubtext}>Select images to start processing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Processing {images.length} image{images.length > 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          style={[styles.processButton, currentProcessing >= 0 && styles.processButtonDisabled]}
          onPress={processImages}
          disabled={currentProcessing >= 0}
        >
          {currentProcessing >= 0 ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="play" size={20} color="#fff" />
          )}
          <Text style={styles.processButtonText}>
            {currentProcessing >= 0 ? 'Processing...' : 'Start Processing'}
          </Text>
        </TouchableOpacity>
      </View>

      {currentProcessing >= 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Processing image {currentProcessing + 1} of {images.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
      )}

      <ScrollView style={styles.imageList} showsVerticalScrollIndicator={false}>
        {processedImages.map((image, index) => (
          <View key={image.id} style={styles.imageItem}>
            <View style={styles.imageHeader}>
              <Text style={styles.imageTitle}>{image.fileName}</Text>
              {image.error ? (
                <Ionicons name="alert-circle" size={20} color="#ff4444" />
              ) : image.processedUri ? (
                <Ionicons name="checkmark-circle" size={20} color="#44ff44" />
              ) : (
                <ActivityIndicator size="small" color="#007AFF" />
              )}
            </View>

            {image.error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{image.error}</Text>
              </View>
            ) : (
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: showOriginal[image.id] ? image.originalUri : (image.processedUri || image.originalUri)
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
                
                {image.processedUri && (
                  <View style={styles.imageActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => toggleView(image.id)}
                    >
                      <Ionicons
                        name={showOriginal[image.id] ? "eye-off" : "eye"}
                        size={20}
                        color="#007AFF"
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => saveToGallery(image.processedUri!, image.fileName)}
                    >
                      <Ionicons name="download" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => shareImage(image.processedUri!)}
                    >
                      <Ionicons name="share" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => toggleFavorite(image)}
                    >
                      <Ionicons name="heart" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                )}

                {image.processingTime > 0 && (
                  <Text style={styles.processingTime}>
                    Processed in {(image.processingTime / 1000).toFixed(1)}s
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  processButtonDisabled: {
    backgroundColor: '#666',
  },
  processButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#3a3a3a',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressPercentage: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  imageList: {
    flex: 1,
  },
  imageItem: {
    backgroundColor: '#2a2a2a',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  imageContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  actionButton: {
    padding: 12,
    marginHorizontal: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
  },
  processingTime: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

