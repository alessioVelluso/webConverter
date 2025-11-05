export type FileCategory = 'image' | 'audio' | 'video' | 'document' | 'archive'

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'svg' | 'avif'
export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a' | 'flac' | 'aac'
export type VideoFormat = 'mp4' | 'webm' | 'mkv' | 'avi' | 'mov'
export type DocumentFormat = 'pdf' | 'docx' | 'txt' | 'md'
export type ArchiveFormat = 'zip' | 'rar' | '7z' | 'tar' | 'gz'

export type FileFormat = ImageFormat | AudioFormat | VideoFormat | DocumentFormat | ArchiveFormat

export type FormatInfo = {
  format: FileFormat;
  label: string;
  mimeTypes: string[];
  category: FileCategory;
  maxSize: number;
}

export type ConversionConfig = {
  [key in FileCategory]: {
    formats: FileFormat[];
    conversions: Record<string, FileFormat[]>;
    maxSize: number;
  };
}

export type ConversionResult = {
  success: boolean;
  fileName?: string;
  filePath?: string;
  error?: string;
  fileSize?: number;
}

export type ValidationResult = {
  isValid: boolean;
  error?: string;
}
