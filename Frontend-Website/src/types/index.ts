export interface ProcessingSettings {
  colorize: boolean
  upscale: boolean
  denoise: boolean
  upscaleFactor: 2 | 4
  denoiseSigma: number
  cache: boolean
  translate: boolean
  srcLang: string
  destLang: string
}

export interface ProcessedImage {
  id: number
  originalFile: File
  originalUrl: string
  processedUrl: string | null
  error: string | null
  processingTime: number
}

export interface ApiResponse {
  colorImgData?: string
  translatedImgData?: string
  msg?: string
}