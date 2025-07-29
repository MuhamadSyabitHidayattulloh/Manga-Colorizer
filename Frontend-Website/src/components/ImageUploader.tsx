'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

interface ImageUploaderProps {
  onImagesUploaded: (files: File[]) => void
  disabled?: boolean
}

export default function ImageUploader({ onImagesUploaded, disabled }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      onImagesUploaded(imageFiles)
    }
  }, [onImagesUploaded])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp']
    },
    multiple: true,
    disabled
  })

  const removeFile = (index: number) => {
    const newFiles = acceptedFiles.filter((_, i) => i !== index)
    onImagesUploaded(newFiles)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <ImageIcon className="mr-2" />
        Upload Images
      </h2>
      
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg">Drop the images here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop manga images here, or click to select</p>
            <p className="text-sm text-gray-400">Supports PNG, JPG, JPEG, WebP, BMP</p>
          </div>
        )}
      </div>

      {acceptedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Selected Images ({acceptedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {acceptedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={disabled}
                >
                  <X size={16} />
                </button>
                <p className="text-xs text-gray-400 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}