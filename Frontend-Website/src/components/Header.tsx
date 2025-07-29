'use client'

import { useState } from 'react'
import { Settings, TestTube, CheckCircle, XCircle } from 'lucide-react'

interface HeaderProps {
  apiUrl: string
  onApiUrlChange: (url: string) => void
}

export default function Header({ apiUrl, onApiUrlChange }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl)

  const testApiConnection = async () => {
    setTestStatus('testing')
    try {
      const response = await fetch(tempApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain'
        }
      })
      
      if (response.ok) {
        const text = await response.text()
        if (text.includes('Manga Colorizer is Up and Running')) {
          setTestStatus('success')
          onApiUrlChange(tempApiUrl)
        } else {
          setTestStatus('error')
        }
      } else {
        setTestStatus('error')
      }
    } catch (error) {
      console.error('API test failed:', error)
      setTestStatus('error')
    }
    
    setTimeout(() => setTestStatus('idle'), 3000)
  }

  const handleSaveSettings = () => {
    onApiUrlChange(tempApiUrl)
    setShowSettings(false)
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-red-500">Manga Colorizer</h1>
            <span className="text-sm text-gray-400">AI-Powered Colorization</span>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">API URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempApiUrl}
                    onChange={(e) => setTempApiUrl(e.target.value)}
                    className="input-field flex-1"
                    placeholder="https://127.0.0.1:5000"
                  />
                  <button
                    onClick={testApiConnection}
                    disabled={testStatus === 'testing'}
                    className="btn-secondary flex items-center space-x-2 min-w-[100px]"
                  >
                    {testStatus === 'testing' && <div className="loading-spinner" />}
                    {testStatus === 'success' && <CheckCircle size={16} className="text-green-500" />}
                    {testStatus === 'error' && <XCircle size={16} className="text-red-500" />}
                    {testStatus === 'idle' && <TestTube size={16} />}
                    <span>
                      {testStatus === 'testing' ? 'Testing...' : 
                       testStatus === 'success' ? 'Success' :
                       testStatus === 'error' ? 'Failed' : 'Test'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enter your Manga Colorizer API endpoint URL
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSaveSettings}
                  className="btn-primary"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false)
                    setTempApiUrl(apiUrl)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}