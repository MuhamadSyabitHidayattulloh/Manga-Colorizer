'use client'

import { useState, useEffect } from 'react'
import { Play, Download, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { ProcessingSettings, ProcessedImage } from '@/types'

interface ImageProcessorProps {
  apiUrl: string
  images: File[]
  settings: ProcessingSettings
  onImageProcessed: (processedImage: ProcessedImage) => void
  onProcessingStateChange: (processing: boolean) => void
  processedImages: ProcessedImage[]
}

export default function ImageProcessor({
  apiUrl,
  images,
  settings,
  onImageProcessed,
  onProcessingStateChange,
  processedImages
}: ImageProcessorProps) {
  const [currentProcessing, setCurrentProcessing] = useState<number>(-1)
  const [progress, setProgress] = useState(0)
  const [showOriginal, setShowOriginal] = useState<{ [key: number]: boolean }>({})

  const processImages = async () => {
    if (!apiUrl || images.length === 0) return

    onProcessingStateChange(true)
    setProgress(0)

    for (let i = 0; i < images.length; i++) {
      setCurrentProcessing(i)
      
      try {
        const processedImage = await processImage(images[i], i)
        onImageProcessed(processedImage)
      } catch (error) {
        console.error(`Error processing image ${i}:`, error)
        onImageProcessed({
          id: i,
          originalFile: images[i],
          originalUrl: URL.createObjectURL(images[i]),
          processedUrl: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          processingTime: 0
        })
      }

      setProgress(((i + 1) / images.length) * 100)
    }

    setCurrentProcessing(-1)
    onProcessingStateChange(false)
  }

  const processImage = async (file: File, index: number): Promise<ProcessedImage> => {
    const startTime = Date.now()
    
    // Convert file to base64
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        const imgData = canvas.toDataURL('image/png')
        
        const isTranslate = settings.translate;
        const endpoint = isTranslate ? 'translate-image-data' : 'colorize-image-data';

        const postData: any = {
          imgName: file.name,
          imgData: imgData,
          imgWidth: img.width,
          imgHeight: img.height,
        }

        if (isTranslate) {
          postData.srcLang = settings.srcLang;
          postData.destLang = settings.destLang;
        } else {
          postData.cache = settings.cache;
          postData.denoise = settings.denoise;
          postData.colorize = settings.colorize;
          postData.upscale = settings.upscale;
          postData.denoiseSigma = settings.denoiseSigma;
          postData.upscaleFactor = settings.upscaleFactor;
          postData.mangaTitle = '';
          postData.mangaChapter = '';
        }

        try {
          const response = await fetch(`${apiUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()
          const processingTime = Date.now() - startTime
          const processedUrl = result.translatedImgData || result.colorImgData;

          if (processedUrl) {
            resolve({
              id: index,
              originalFile: file,
              originalUrl: URL.createObjectURL(file),
              processedUrl: processedUrl,
              error: null,
              processingTime
            })
          } else if (result.msg) {
            throw new Error(result.msg)
          } else {
            throw new Error('No processed image data received')
          }
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `colorized_${filename}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleOriginal = (index: number) => {
    setShowOriginal(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const resetProcessing = () => {
    setCurrentProcessing(-1)
    setProgress(0)
    onProcessingStateChange(false)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Process Images</h2>
        <div className="flex space-x-2">
          {currentProcessing >= 0 && (
            <button
              onClick={resetProcessing}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Stop</span>
            </button>
          )}
          <button
            onClick={processImages}
            disabled={currentProcessing >= 0 || !apiUrl}
            className="btn-primary flex items-center space-x-2"
          >
            <Play size={16} />
            <span>
              {currentProcessing >= 0 ? 'Processing...' : 'Start Processing'}
            </span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {currentProcessing >= 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Processing image {currentProcessing + 1} of {images.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Grid */}
      {processedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processedImages.map((processedImage) => (
            <div key={processedImage.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold truncate">
                  {processedImage.originalFile.name}
                </h3>
                <div className="flex space-x-2">
                  {processedImage.processedUrl && (
                    <>
                      <button
                        onClick={() => toggleOriginal(processedImage.id)}
                        className="btn-secondary p-2"
                        title={showOriginal[processedImage.id] ? 'Show Processed' : 'Show Original'}
                      >
                        {showOriginal[processedImage.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => downloadImage(processedImage.processedUrl!, processedImage.originalFile.name)}
                        className="btn-primary p-2"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden mb-3">
                {processedImage.error ? (
                  <div className="w-full h-full flex items-center justify-center text-red-400 text-center p-4">
                    <div>
                      <p className="font-semibold mb-2">Processing Failed</p>
                      <p className="text-sm">{processedImage.error}</p>
                    </div>
                  </div>
                ) : processedImage.processedUrl ? (
                  <img
                    src={showOriginal[processedImage.id] ? processedImage.originalUrl : processedImage.processedUrl}
                    alt={`${showOriginal[processedImage.id] ? 'Original' : 'Processed'} ${processedImage.originalFile.name}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="loading-spinner" />
                  </div>
                )}
              </div>

              {processedImage.processedUrl && (
                <div className="text-xs text-gray-400">
                  Processing time: {(processedImage.processingTime / 1000).toFixed(1)}s
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}