import { ConversionConfig, FormatInfo, FileFormat, FileCategory } from '@/types/formats'

export const FORMAT_INFO: Record<FileFormat, FormatInfo> = {
  // Images
  jpg: { format: 'jpg', label: 'JPG', mimeTypes: ['image/jpeg'], category: 'image', maxSize: 10 * 1024 * 1024 },
  jpeg: { format: 'jpeg', label: 'JPEG', mimeTypes: ['image/jpeg'], category: 'image', maxSize: 10 * 1024 * 1024 },
  png: { format: 'png', label: 'PNG', mimeTypes: ['image/png'], category: 'image', maxSize: 10 * 1024 * 1024 },
  webp: { format: 'webp', label: 'WebP', mimeTypes: ['image/webp'], category: 'image', maxSize: 10 * 1024 * 1024 },
  gif: { format: 'gif', label: 'GIF', mimeTypes: ['image/gif'], category: 'image', maxSize: 10 * 1024 * 1024 },
  bmp: { format: 'bmp', label: 'BMP', mimeTypes: ['image/bmp'], category: 'image', maxSize: 10 * 1024 * 1024 },
  svg: { format: 'svg', label: 'SVG', mimeTypes: ['image/svg+xml'], category: 'image', maxSize: 5 * 1024 * 1024 },
  avif: { format: 'avif', label: 'AVIF', mimeTypes: ['image/avif'], category: 'image', maxSize: 10 * 1024 * 1024 },

  // Audio
  mp3: { format: 'mp3', label: 'MP3', mimeTypes: ['audio/mpeg'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  wav: { format: 'wav', label: 'WAV', mimeTypes: ['audio/wav', 'audio/wave'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  ogg: { format: 'ogg', label: 'OGG', mimeTypes: ['audio/ogg'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  m4a: { format: 'm4a', label: 'M4A', mimeTypes: ['audio/mp4', 'audio/m4a'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  flac: { format: 'flac', label: 'FLAC', mimeTypes: ['audio/flac'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  aac: { format: 'aac', label: 'AAC', mimeTypes: ['audio/aac'], category: 'audio', maxSize: 50 * 1024 * 1024 },

  // Video
  mp4: { format: 'mp4', label: 'MP4', mimeTypes: ['video/mp4'], category: 'video', maxSize: 200 * 1024 * 1024 },
  webm: { format: 'webm', label: 'WebM', mimeTypes: ['video/webm'], category: 'video', maxSize: 200 * 1024 * 1024 },
  mkv: { format: 'mkv', label: 'MKV', mimeTypes: ['video/x-matroska'], category: 'video', maxSize: 200 * 1024 * 1024 },
  avi: { format: 'avi', label: 'AVI', mimeTypes: ['video/x-msvideo'], category: 'video', maxSize: 200 * 1024 * 1024 },
  mov: { format: 'mov', label: 'MOV', mimeTypes: ['video/quicktime'], category: 'video', maxSize: 200 * 1024 * 1024 },

  // Documents
  pdf: { format: 'pdf', label: 'PDF', mimeTypes: ['application/pdf'], category: 'document', maxSize: 20 * 1024 * 1024 },
  docx: { format: 'docx', label: 'DOCX', mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], category: 'document', maxSize: 20 * 1024 * 1024 },
  txt: { format: 'txt', label: 'TXT', mimeTypes: ['text/plain'], category: 'document', maxSize: 10 * 1024 * 1024 },
  md: { format: 'md', label: 'Markdown', mimeTypes: ['text/markdown'], category: 'document', maxSize: 10 * 1024 * 1024 },

  // Archives
  zip: { format: 'zip', label: 'ZIP', mimeTypes: ['application/zip'], category: 'archive', maxSize: 100 * 1024 * 1024 },
  rar: { format: 'rar', label: 'RAR', mimeTypes: ['application/x-rar-compressed'], category: 'archive', maxSize: 100 * 1024 * 1024 },
  '7z': { format: '7z', label: '7Z', mimeTypes: ['application/x-7z-compressed'], category: 'archive', maxSize: 100 * 1024 * 1024 },
  tar: { format: 'tar', label: 'TAR', mimeTypes: ['application/x-tar'], category: 'archive', maxSize: 100 * 1024 * 1024 },
  gz: { format: 'gz', label: 'GZIP', mimeTypes: ['application/gzip'], category: 'archive', maxSize: 100 * 1024 * 1024 },
}

export const CONVERSION_CONFIG: ConversionConfig = {
  image: {
    formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'avif'],
    conversions: {
      jpg: ['png', 'webp', 'gif', 'bmp', 'avif'],
      jpeg: ['png', 'webp', 'gif', 'bmp', 'avif'],
      png: ['jpg', 'webp', 'gif', 'bmp', 'avif'],
      webp: ['jpg', 'png', 'gif', 'bmp', 'avif'],
      gif: ['jpg', 'png', 'webp', 'bmp'],
      bmp: ['jpg', 'png', 'webp', 'gif', 'avif'],
      svg: ['png', 'jpg', 'webp'],
      avif: ['jpg', 'png', 'webp', 'bmp'],
    },
    maxSize: 10 * 1024 * 1024,
  },
  audio: {
    formats: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'],
    conversions: {
      mp3: ['wav', 'ogg', 'm4a', 'flac', 'aac'],
      wav: ['mp3', 'ogg', 'm4a', 'flac', 'aac'],
      ogg: ['mp3', 'wav', 'm4a', 'flac', 'aac'],
      m4a: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
      flac: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
      aac: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
    },
    maxSize: 100 * 1024 * 1024,
  },
  video: {
    formats: ['mp4', 'webm', 'mkv', 'avi', 'mov'],
    conversions: {
      mp4: ['webm', 'mkv', 'avi', 'mov'],
      webm: ['mp4', 'mkv', 'avi', 'mov'],
      mkv: ['mp4', 'webm', 'avi', 'mov'],
      avi: ['mp4', 'webm', 'mkv', 'mov'],
      mov: ['mp4', 'webm', 'mkv', 'avi'],
    },
    maxSize: 200 * 1024 * 1024,
  },
  document: {
    formats: ['pdf', 'docx', 'txt', 'md'],
    conversions: {
      pdf: ['txt'],
      docx: ['txt', 'pdf'],
      txt: ['pdf', 'md'],
      md: ['txt', 'pdf'],
    },
    maxSize: 20 * 1024 * 1024,
  },
  archive: {
    formats: ['zip', 'tar', 'gz'],
    conversions: {
      zip: ['tar', 'gz'],
      tar: ['zip', 'gz'],
      gz: ['zip', 'tar'],
    },
    maxSize: 100 * 1024 * 1024,
  },
}

export const CATEGORY_INFO: Record<FileCategory, { label: string; icon: string }> = {
  image: { label: 'Image', icon: '🖼️' },
  audio: { label: 'Audio', icon: '🎵' },
  video: { label: 'Video', icon: '🎬' },
  document: { label: 'Document', icon: '📄' },
  archive: { label: 'Archive', icon: '📦' },
}

export function getFormatsByCategory(category: FileCategory): FileFormat[] {
  return CONVERSION_CONFIG[category].formats
}

export function getAvailableConversions(sourceFormat: FileFormat): FileFormat[] {
  const formatInfo = FORMAT_INFO[sourceFormat]
  const category = formatInfo.category
  return CONVERSION_CONFIG[category].conversions[sourceFormat] || []
}

export function isConversionSupported(sourceFormat: FileFormat, targetFormat: FileFormat): boolean {
  const availableConversions = getAvailableConversions(sourceFormat)
  return availableConversions.includes(targetFormat)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
