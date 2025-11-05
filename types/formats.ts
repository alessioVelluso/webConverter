export type FileCategory = 'image' | 'audio' | 'video' | 'document' | 'archive'

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'bmp' | 'svg' | 'avif' | 'ico' | 'tiff' | 'tif' | 'heic' | 'heif' | 'eps' | 'psd' | 'dds' | 'tga'
export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a' | 'flac' | 'aac' | 'aiff' | 'aif' | 'wma' | 'opus' | 'amr' | 'wv' | 'alac'
export type VideoFormat = 'mp4' | 'webm' | 'mkv' | 'avi' | 'mov' | 'flv' | 'wmv' | 'mpeg' | 'mpg' | 'm4v' | 'vob' | 'ts' | '3gp' | 'ogv'
export type DocumentFormat = 'pdf' | 'docx' | 'txt' | 'odt' | 'rtf' | 'epub' | 'html' | 'xml' | 'json' | 'yaml' | 'csv' | 'doc'
export type ArchiveFormat = 'zip' | 'rar' | '7z' | 'tar' | 'gz' | 'bz2' | 'xz' | 'tgz' | 'zst'

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
