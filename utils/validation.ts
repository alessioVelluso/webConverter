import { FileFormat, ValidationResult } from '@/types/formats'
import { FORMAT_INFO } from '@/lib/formats'

export function validateFile(file: File, expectedFormat: FileFormat): ValidationResult {
  const formatInfo = FORMAT_INFO[expectedFormat]

  if (!formatInfo) {
    return {
      isValid: false,
      error: 'Invalid file format specified',
    }
  }

  // Check file size
  if (file.size > formatInfo.maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${formatInfo.maxSize / (1024 * 1024)}MB`,
    }
  }

  // Check MIME type
  const mimeTypeValid = formatInfo.mimeTypes.some(mimeType =>
    file.type === mimeType || file.type === ''
  )

  // Check file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const extensionValid = fileExtension === formatInfo.format || fileExtension === expectedFormat

  if (!mimeTypeValid && !extensionValid) {
    return {
      isValid: false,
      error: `Invalid file type. Expected ${formatInfo.label} file`,
    }
  }

  return { isValid: true }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isValidFileExtension(filename: string, format: FileFormat): boolean {
  const extension = getFileExtension(filename)
  return extension === format || (format === 'jpeg' && extension === 'jpg')
}
