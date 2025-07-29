import { Github, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-500">Manga Colorizer</h3>
            <p className="text-gray-400 text-sm">
              Transform your black and white manga into vibrant colored masterpieces using advanced AI technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• AI-powered colorization</li>
              <li>• Super-resolution upscaling</li>
              <li>• Intelligent denoising</li>
              <li>• Batch processing</li>
              <li>• Multiple format support</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <div className="space-y-2">
              <a 
                href="https://github.com/BinitDOX/Manga-Colorizer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Github size={16} />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center">
            Made with <Heart size={16} className="mx-1 text-red-500" /> by the Manga Colorizer Team
          </p>
        </div>
      </div>
    </footer>
  )
}