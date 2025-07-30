export interface ProcessingSettings {
  colorize: boolean;
  upscale: boolean;
  denoise: boolean;
  upscaleFactor: 2 | 4;
  denoiseSigma: number;
  cache: boolean;
}

export interface ProcessedImage {
  id: number;
  originalUri: string;
  processedUri: string | null;
  error: string | null;
  processingTime: number;
  fileName: string;
}

export interface ApiResponse {
  colorImgData?: string;
  msg?: string;
}

export interface ImageAsset {
  uri: string;
  fileName: string;
  type: string;
  size: number;
}

