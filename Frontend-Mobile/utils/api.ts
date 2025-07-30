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
      // Create FormData
      const formData = new FormData();
      
      // Add image file
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      // Add processing parameters
      formData.append('colorize', settings.colorize ? '1' : '0');
      formData.append('upscale', settings.upscale ? '1' : '0');
      formData.append('denoise', settings.denoise ? '1' : '0');
      formData.append('upscale_factor', settings.upscaleFactor.toString());
      formData.append('denoise_sigma', settings.denoiseSigma.toString());
      formData.append('cache', settings.cache ? '1' : '0');

      const response = await fetch(`${this.baseUrl}/colorize-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

