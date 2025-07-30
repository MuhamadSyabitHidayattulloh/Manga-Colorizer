import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProcessingSettings, ProcessedImage } from '../types';

const STORAGE_KEYS = {
  API_URL: 'manga_colorizer_api_url',
  SETTINGS: 'manga_colorizer_settings',
  PROCESSING_HISTORY: 'manga_colorizer_history',
  FAVORITES: 'manga_colorizer_favorites',
};

export const StorageService = {
  // API URL
  async getApiUrl(): Promise<string> {
    try {
      const url = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
      return url || 'https://127.0.0.1:5000';
    } catch (error) {
      console.error('Error getting API URL:', error);
      return 'https://127.0.0.1:5000';
    }
  },

  async setApiUrl(url: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_URL, url);
    } catch (error) {
      console.error('Error setting API URL:', error);
    }
  },

  // Processing Settings
  async getSettings(): Promise<ProcessingSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settings) {
        return JSON.parse(settings);
      }
      return {
        colorize: true,
        upscale: true,
        denoise: true,
        upscaleFactor: 4,
        denoiseSigma: 25,
        cache: false,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        colorize: true,
        upscale: true,
        denoise: true,
        upscaleFactor: 4,
        denoiseSigma: 25,
        cache: false,
      };
    }
  },

  async setSettings(settings: ProcessingSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error setting settings:', error);
    }
  },

  // Processing History
  async getProcessingHistory(): Promise<ProcessedImage[]> {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.PROCESSING_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting processing history:', error);
      return [];
    }
  },

  async addToProcessingHistory(image: ProcessedImage): Promise<void> {
    try {
      const history = await this.getProcessingHistory();
      const updatedHistory = [image, ...history.slice(0, 49)]; // Keep last 50 items
      await AsyncStorage.setItem(STORAGE_KEYS.PROCESSING_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error adding to processing history:', error);
    }
  },

  async clearProcessingHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PROCESSING_HISTORY);
    } catch (error) {
      console.error('Error clearing processing history:', error);
    }
  },

  // Favorites
  async getFavorites(): Promise<ProcessedImage[]> {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async addToFavorites(image: ProcessedImage): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === image.id);
      if (!isAlreadyFavorite) {
        const updatedFavorites = [image, ...favorites];
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  },

  async removeFromFavorites(imageId: number): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== imageId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  async isFavorite(imageId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === imageId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  },
};

