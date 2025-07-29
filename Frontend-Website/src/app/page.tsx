'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import ImageUploader from '@/components/ImageUploader'
import ProcessingOptions from '@/components/ProcessingOptions'
import ImageProcessor from '@/components/ImageProcessor'
import Footer from '@/components/Footer'
import { ProcessingSettings, ProcessedImage } from '@/types'

export default function Home() {
  const [apiUrl, setApiUrl] = useState('https://127.0.0.1:5000')
  const [settings, setSettings] = useState<ProcessingSettings>({
    colorize: true,
    upscale: true,
    denoise: true,
    upscaleFactor: 4,
    denoiseSigma: 25,
    cache: false,
    translate: false,
    srcLang: 'auto',
    destLang: 'en'
  })
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImagesUploaded = (files: File[]) => {
    setUploadedImages(files)
    setProcessedImages([])
  }

  const handleSettingsChange = (newSettings: ProcessingSettings) => {
    setSettings(newSettings)
  }

  const handleImageProcessed = (processedImage: ProcessedImage) => {
    setProcessedImages(prev => [...prev, processedImage])
  }

  const handleProcessingStateChange = (processing: boolean) => {
    setIsProcessing(processing)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header apiUrl={apiUrl} onApiUrlChange={setApiUrl} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Manga Colorizer
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transform your black and white manga into vibrant colored masterpieces using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <ImageUploader 
              onImagesUploaded={handleImagesUploaded}
              disabled={isProcessing}
            />
          </div>

          {/* Settings Section */}
          <div>
            <ProcessingOptions 
              settings={settings}
              onSettingsChange={handleSettingsChange}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Processing Section */}
        {uploadedImages.length > 0 && (
          <div className="mt-12">
            <ImageProcessor
              apiUrl={apiUrl}
              images={uploadedImages}
              settings={settings}
              onImageProcessed={handleImageProcessed}
              onProcessingStateChange={handleProcessingStateChange}
              processedImages={processedImages}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}