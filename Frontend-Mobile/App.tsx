import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from './components/Header';
import ImagePicker from './components/ImagePicker';
import ProcessingOptions from './components/ProcessingOptions';
import ImageProcessor from './components/ImageProcessor';
import HistoryScreen from './components/HistoryScreen';

import { ProcessingSettings, ProcessedImage, ImageAsset } from './types';
import { StorageService } from './utils/storage';

type Screen = 'home' | 'history';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [apiUrl, setApiUrl] = useState('https://127.0.0.1:5000');
  const [settings, setSettings] = useState<ProcessingSettings>({
    colorize: true,
    upscale: true,
    denoise: true,
    upscaleFactor: 4,
    denoiseSigma: 25,
    cache: false,
  });
  const [selectedImages, setSelectedImages] = useState<ImageAsset[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedApiUrl, storedSettings] = await Promise.all([
        StorageService.getApiUrl(),
        StorageService.getSettings(),
      ]);
      setApiUrl(storedApiUrl);
      setSettings(storedSettings);
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const handleApiUrlChange = async (newUrl: string) => {
    setApiUrl(newUrl);
    await StorageService.setApiUrl(newUrl);
  };

  const handleSettingsChange = async (newSettings: ProcessingSettings) => {
    setSettings(newSettings);
    await StorageService.setSettings(newSettings);
  };

  const handleImagesSelected = (images: ImageAsset[]) => {
    setSelectedImages(images);
    setProcessedImages([]);
  };

  const handleImagesProcessed = (images: ProcessedImage[]) => {
    setProcessedImages(images);
  };

  const handleProcessingStateChange = (processing: boolean) => {
    setIsProcessing(processing);
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tabButton, currentScreen === 'home' && styles.activeTabButton]}
        onPress={() => setCurrentScreen('home')}
      >
        <Ionicons
          name={currentScreen === 'home' ? 'home' : 'home-outline'}
          size={24}
          color={currentScreen === 'home' ? '#007AFF' : '#666'}
        />
        <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, currentScreen === 'history' && styles.activeTabButton]}
        onPress={() => setCurrentScreen('history')}
      >
        <Ionicons
          name={currentScreen === 'history' ? 'time' : 'time-outline'}
          size={24}
          color={currentScreen === 'history' ? '#007AFF' : '#666'}
        />
        <Text style={[styles.tabText, currentScreen === 'history' && styles.activeTabText]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHomeScreen = () => (
    <View style={styles.container}>
      <Header apiUrl={apiUrl} onApiUrlChange={handleApiUrlChange} />
      
      <View style={styles.content}>
        <ImagePicker
          onImagesSelected={handleImagesSelected}
          disabled={isProcessing}
        />

        <ProcessingOptions
          settings={settings}
          onSettingsChange={handleSettingsChange}
          disabled={isProcessing}
        />

        {selectedImages.length > 0 && (
          <ImageProcessor
            apiUrl={apiUrl}
            images={selectedImages}
            settings={settings}
            onImagesProcessed={handleImagesProcessed}
            onProcessingStateChange={handleProcessingStateChange}
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {currentScreen === 'home' ? renderHomeScreen() : <HistoryScreen />}
      
      {renderTabBar()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    // No additional styling needed, color is handled by icon and text
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#007AFF',
  },
});

