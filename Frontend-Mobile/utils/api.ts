import * as FileSystem from 'expo-file-system';
import { ProcessingSettings, ApiResponse } from '../types';

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const text = await response.text();
        return text.includes('Manga Colorizer is Up and Running!');
      }
      return false;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async processImage(
    imageUri: string,
    settings: ProcessingSettings,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

      const response = await fetch(`${this.baseUrl}/colorize-image-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          colorize: settings.colorize ? 1 : 0,
          upscale: settings.upscale ? 1 : 0,
          denoise: settings.denoise ? 1 : 0,
          upscale_factor: settings.upscaleFactor,
          denoise_sigma: settings.denoiseSigma,
          cache: settings.cache ? 1 : 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (result.colorImgData) {
        return `data:image/jpeg;base64,${result.colorImgData}`;
      } else if (result.msg) {
        throw new Error(result.msg);
      } else {
        throw new Error('No image data received from server');
      }
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    }
  }

  updateBaseUrl(newUrl: string) {
    this.baseUrl = newUrl;
  }
}

