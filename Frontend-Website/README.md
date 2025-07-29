# Manga Colorizer - Next.js Frontend

A modern web application for colorizing black and white manga images using AI technology.

## Features

- **Drag & Drop Upload**: Easy image uploading with drag and drop support
- **Batch Processing**: Process multiple images at once
- **Real-time Preview**: See original and processed images side by side
- **Customizable Settings**: Control colorization, upscaling, and denoising options
- **Progress Tracking**: Monitor processing progress with visual indicators
- **Download Results**: Download processed images directly
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running Manga Colorizer backend server

### Installation

1. Navigate to the Frontend-Website directory:
```bash
cd Frontend-Website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. Click the "Settings" button in the header
2. Enter your Manga Colorizer API URL (e.g., `https://127.0.0.1:5000`)
3. Click "Test" to verify the connection
4. Save the settings

## Usage

1. **Upload Images**: Drag and drop manga images or click to select files
2. **Configure Options**: 
   - Toggle colorization, upscaling, and denoising
   - Adjust upscale factor (2x or 4x)
   - Set denoise sigma value
   - Enable/disable caching
3. **Process**: Click "Start Processing" to begin
4. **Download**: Download individual processed images or view comparisons

## Supported Formats

- PNG
- JPG/JPEG
- WebP
- BMP

## Building for Production

```bash
npm run build
npm start
```

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Dropzone**: File upload handling
- **Lucide React**: Modern icon library

## API Integration

The frontend communicates with the Manga Colorizer backend API using the same endpoints as the browser extensions:

- `GET /`: Health check
- `POST /colorize-image-data`: Process images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.