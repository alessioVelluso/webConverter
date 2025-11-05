'use client'

import { useState } from 'react'
import { FileCategory, FileFormat } from '@/types/formats'
import { getFormatsByCategory, getAvailableConversions } from '@/lib/formats'
import CategorySelector from '@/components/CategorySelector'
import FormatSelector from '@/components/FormatSelector'
import FileUpload from '@/components/FileUpload'
import ProgressBar from '@/components/ProgressBar'
import { convertFile } from '@/actions/convert'

type ConversionStep = 'category' | 'formats' | 'upload' | 'converting' | 'complete'

export default function Home()
{
  const [step, setStep] = useState<ConversionStep>('category')
  const [category, setCategory] = useState<FileCategory | null>(null)
  const [sourceFormat, setSourceFormat] = useState<FileFormat | null>(null)
  const [targetFormat, setTargetFormat] = useState<FileFormat | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [convertedFile, setConvertedFile] = useState<{ name: string; data: string; size: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCategorySelect = (cat: FileCategory) => {
    setCategory(cat)
    setSourceFormat(null)
    setTargetFormat(null)
    setStep('formats')
    setError(null)
  }

  const handleSourceFormatSelect = (format: FileFormat) => {
    setSourceFormat(format)
    setTargetFormat(null)
  }

  const handleTargetFormatSelect = (format: FileFormat) => {
    setTargetFormat(format)
    setStep('upload')
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleConvert = async () => {
    if (!selectedFile || !sourceFormat || !targetFormat) {
      setError('Please complete all steps before converting')
      return
    }

    setStep('converting')
    setProgress(0)
    setStatus('Preparing conversion...')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('sourceFormat', sourceFormat)
      formData.append('targetFormat', targetFormat)

      setProgress(30)
      setStatus('Converting file...')

      const result = await convertFile(formData)

      if (!result.success) {
        throw new Error(result.error || 'Conversion failed')
      }

      setProgress(100)
      setStatus('Conversion complete!')
      setConvertedFile({
        name: result.fileName || `converted.${targetFormat}`,
        data: result.filePath || '',
        size: result.fileSize || 0,
      })
      setStep('complete')
    } catch (err) {
      console.error('Conversion error:', err)
      setError(err instanceof Error ? err.message : 'Conversion failed')
      setStep('upload')
      setProgress(0)
    }
  }

  const handleDownload = () => {
    if (!convertedFile) return

    const link = document.createElement('a')
    link.href = convertedFile.data
    link.download = convertedFile.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setStep('category')
    setCategory(null)
    setSourceFormat(null)
    setTargetFormat(null)
    setSelectedFile(null)
    setProgress(0)
    setStatus('')
    setConvertedFile(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            File Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Convert your files to any format - images, audio, video, documents, and more
          </p>
        </header>

        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {step === 'category' && (
            <CategorySelector
              selectedCategory={category}
              onSelectCategory={handleCategorySelect}
            />
          )}

          {step === 'formats' && category && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Select Formats</h2>
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  ← Back to Categories
                </button>
              </div>

              <FormatSelector
                formats={getFormatsByCategory(category)}
                selectedFormat={sourceFormat}
                onSelectFormat={handleSourceFormatSelect}
                label="Source Format"
              />

              {sourceFormat && (
                <FormatSelector
                  formats={getAvailableConversions(sourceFormat)}
                  selectedFormat={targetFormat}
                  onSelectFormat={handleTargetFormatSelect}
                  label="Target Format"
                />
              )}
            </div>
          )}

          {(step === 'upload' || step === 'converting') && sourceFormat && targetFormat && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upload File</h2>
                <button
                  onClick={() => setStep('formats')}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  disabled={step === 'converting'}
                >
                  ← Change Formats
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-center text-lg">
                  Converting from <span className="font-bold">{sourceFormat.toUpperCase()}</span> to{' '}
                  <span className="font-bold">{targetFormat.toUpperCase()}</span>
                </p>
              </div>

              {step === 'upload' && (
                <>
                  <FileUpload
                    sourceFormat={sourceFormat}
                    onFileSelect={handleFileSelect}
                  />

                  {selectedFile && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="font-medium mb-2">Selected File:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>

                      <button
                        onClick={handleConvert}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
                      >
                        Convert File
                      </button>
                    </div>
                  )}
                </>
              )}

              {step === 'converting' && (
                <div className="space-y-4">
                  <ProgressBar progress={progress} status={status} />
                </div>
              )}
            </div>
          )}

          {step === 'complete' && convertedFile && (
            <div className="text-center space-y-6">
              <div className="inline-block p-6 bg-green-50 dark:bg-green-900/20 rounded-full">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                Conversion Complete!
              </h2>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg max-w-md mx-auto">
                <p className="font-medium mb-2">Converted File:</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {convertedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Size: {(convertedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Download File
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Convert Another File
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p>Universal File Converter - Supporting images, audio, video, documents, and archives</p>
        </footer>
      </div>
    </div>
  )
}
