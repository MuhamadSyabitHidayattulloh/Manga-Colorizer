# Manga Colorizer Mobile

A React Native Expo mobile application for colorizing manga images using AI.

## Features

- **Image Selection**: Pick images from gallery, camera, or files
- **AI Colorization**: Transform black and white manga into vibrant colored images
- **Processing Options**: Configure colorization, upscaling, and denoising settings
- **History & Favorites**: Track processed images and save favorites
- **Local Storage**: Persistent settings and processing history
- **Image Management**: Save to gallery, share, and manage processed images

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on device/simulator:
   ```bash
   # For Android
   npm run android
   
   # For iOS (requires macOS)
   npm run ios
   
   # For web
   npm run web
   ```

## Configuration

1. Open the app and tap the settings icon in the header
2. Enter your Manga Colorizer API URL (e.g., `https://127.0.0.1:5000`)
3. Test the connection to ensure it's working
4. Configure processing options as needed

## Usage

1. **Select Images**: Use the image picker to select manga images from gallery, camera, or files
2. **Configure Settings**: Adjust processing options like colorization, upscaling, and denoising
3. **Process Images**: Tap "Start Processing" to colorize your images
4. **View Results**: See original and processed images side by side
5. **Save & Share**: Save processed images to gallery or share them
6. **Manage History**: View processing history and manage favorites

## API Integration

The app communicates with the Manga Colorizer backend server. Make sure your server is running and accessible from your mobile device.

### Supported API Endpoints

- `GET /` - Health check
- `POST /colorize-image` - Process manga images

### Processing Parameters

- `colorize`: Enable/disable AI colorization
- `upscale`: Enable/disable image upscaling
- `denoise`: Enable/disable noise reduction
- `upscale_factor`: Upscaling factor (2x or 4x)
- `denoise_sigma`: Denoising strength
- `cache`: Enable/disable result caching

## Permissions

The app requires the following permissions:

- **Camera**: To take photos of manga pages
- **Photo Library**: To select and save images
- **Storage**: To access files and save processed images

## Technical Details

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Storage**: AsyncStorage for local data persistence
- **Image Handling**: Expo Image Picker, Document Picker, Media Library
- **UI**: Custom components with dark theme

## File Structure

```
Frontend-Mobile/
├── components/           # React Native components
│   ├── Header.tsx       # App header with settings
│   ├── ImagePicker.tsx  # Image selection component
│   ├── ProcessingOptions.tsx # Settings configuration
│   ├── ImageProcessor.tsx    # Image processing logic
│   └── HistoryScreen.tsx     # History and favorites
├── utils/               # Utility functions
│   ├── storage.ts       # AsyncStorage operations
│   └── api.ts          # API communication
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── App.tsx             # Main application component
├── app.json            # Expo configuration
└── package.json        # Dependencies and scripts
```

## Development

To contribute to the mobile frontend:

1. Follow React Native and Expo best practices
2. Use TypeScript for type safety
3. Maintain consistent styling with the dark theme
4. Test on both iOS and Android platforms
5. Ensure proper error handling and user feedback

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure the backend server is running
   - Check the API URL is correct and accessible
   - Verify network connectivity

2. **Image Processing Errors**
   - Check server logs for detailed error messages
   - Ensure images are in supported formats (JPEG, PNG)
   - Verify server has sufficient resources

3. **Permission Denied**
   - Grant required permissions in device settings
   - Restart the app after granting permissions

4. **Storage Issues**
   - Clear app data if storage becomes corrupted
   - Check device storage space

## License

This project is part of the Manga Colorizer suite. See the main repository for license information.

