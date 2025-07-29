'use client'

import { Palette, Zap, Sparkles, Settings2, Languages } from 'lucide-react'
import { ProcessingSettings } from '@/types'

interface ProcessingOptionsProps {
  settings: ProcessingSettings
  onSettingsChange: (settings: ProcessingSettings) => void
  disabled?: boolean
}

export default function ProcessingOptions({ 
  settings, 
  onSettingsChange, 
  disabled 
}: ProcessingOptionsProps) {
  const updateSetting = (key: keyof ProcessingSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Settings2 className="mr-2" />
        Processing Options
      </h2>

      <div className="space-y-6">
        {/* Main Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="text-red-500" size={20} />
              <span className="font-medium">Colorize</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.colorize}
                onChange={(e) => updateSetting('colorize', e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="text-blue-500" size={20} />
              <span className="font-medium">Upscale</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.upscale}
                onChange={(e) => updateSetting('upscale', e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-green-500" size={20} />
              <span className="font-medium">Denoise</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.denoise}
                onChange={(e) => updateSetting('denoise', e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Languages className="text-yellow-500" size={20} />
              <span className="font-medium">Translate</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.translate}
                onChange={(e) => updateSetting('translate', e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="border-t border-gray-600 pt-4 space-y-4">
          <h3 className="font-semibold text-gray-300">Advanced Settings</h3>
          
          {settings.translate && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Language</label>
                <select
                  value={settings.srcLang}
                  onChange={(e) => updateSetting('srcLang', e.target.value)}
                  disabled={disabled}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="auto">Auto</option>
                  <option value="ja">Japanese</option>
                  <option value="en">English</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Destination Language</label>
                <select
                  value={settings.destLang}
                  onChange={(e) => updateSetting('destLang', e.target.value)}
                  disabled={disabled}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
            </div>
          )}

          {settings.upscale && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Upscale Factor: {settings.upscaleFactor}x
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="upscaleFactor"
                    value={2}
                    checked={settings.upscaleFactor === 2}
                    onChange={(e) => updateSetting('upscaleFactor', parseInt(e.target.value))}
                    disabled={disabled}
                    className="mr-2"
                  />
                  2x
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="upscaleFactor"
                    value={4}
                    checked={settings.upscaleFactor === 4}
                    onChange={(e) => updateSetting('upscaleFactor', parseInt(e.target.value))}
                    disabled={disabled}
                    className="mr-2"
                  />
                  4x
                </label>
              </div>
            </div>
          )}

          {settings.denoise && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Denoise Sigma: {settings.denoiseSigma}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.denoiseSigma}
                onChange={(e) => updateSetting('denoiseSigma', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span>
                <span>100</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Use Cache</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.cache}
                onChange={(e) => updateSetting('cache', e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}