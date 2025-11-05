import { ConversionConfig, FormatInfo, FileFormat, FileCategory } from '@/types/formats'

export const FORMAT_INFO: Record<FileFormat, FormatInfo> = {
  // ===== IMAGES =====
  jpg: { format: 'jpg', label: 'JPG', mimeTypes: ['image/jpeg'], category: 'image', maxSize: 10 * 1024 * 1024 },
  jpeg: { format: 'jpeg', label: 'JPEG', mimeTypes: ['image/jpeg'], category: 'image', maxSize: 10 * 1024 * 1024 },
  png: { format: 'png', label: 'PNG', mimeTypes: ['image/png'], category: 'image', maxSize: 10 * 1024 * 1024 },
  webp: { format: 'webp', label: 'WebP', mimeTypes: ['image/webp'], category: 'image', maxSize: 10 * 1024 * 1024 },
  gif: { format: 'gif', label: 'GIF', mimeTypes: ['image/gif'], category: 'image', maxSize: 10 * 1024 * 1024 },
  bmp: { format: 'bmp', label: 'BMP', mimeTypes: ['image/bmp', 'image/x-windows-bmp'], category: 'image', maxSize: 20 * 1024 * 1024 },
  svg: { format: 'svg', label: 'SVG', mimeTypes: ['image/svg+xml'], category: 'image', maxSize: 5 * 1024 * 1024 },
  avif: { format: 'avif', label: 'AVIF', mimeTypes: ['image/avif'], category: 'image', maxSize: 10 * 1024 * 1024 },
  ico: { format: 'ico', label: 'ICO', mimeTypes: ['image/x-icon', 'image/vnd.microsoft.icon'], category: 'image', maxSize: 5 * 1024 * 1024 },
  tiff: { format: 'tiff', label: 'TIFF', mimeTypes: ['image/tiff'], category: 'image', maxSize: 50 * 1024 * 1024 },
  tif: { format: 'tif', label: 'TIF', mimeTypes: ['image/tiff'], category: 'image', maxSize: 50 * 1024 * 1024 },
  heic: { format: 'heic', label: 'HEIC', mimeTypes: ['image/heic'], category: 'image', maxSize: 20 * 1024 * 1024 },
  heif: { format: 'heif', label: 'HEIF', mimeTypes: ['image/heif'], category: 'image', maxSize: 20 * 1024 * 1024 },
  eps: { format: 'eps', label: 'EPS', mimeTypes: ['application/postscript'], category: 'image', maxSize: 30 * 1024 * 1024 },
  psd: { format: 'psd', label: 'PSD', mimeTypes: ['image/vnd.adobe.photoshop'], category: 'image', maxSize: 100 * 1024 * 1024 },
  dds: { format: 'dds', label: 'DDS', mimeTypes: ['image/vnd-ms.dds'], category: 'image', maxSize: 50 * 1024 * 1024 },
  tga: { format: 'tga', label: 'TGA', mimeTypes: ['image/x-tga'], category: 'image', maxSize: 30 * 1024 * 1024 },
  raw: { format: 'raw', label: 'RAW', mimeTypes: ['image/x-raw'], category: 'image', maxSize: 100 * 1024 * 1024 },
  cr2: { format: 'cr2', label: 'CR2', mimeTypes: ['image/x-canon-cr2'], category: 'image', maxSize: 100 * 1024 * 1024 },
  nef: { format: 'nef', label: 'NEF', mimeTypes: ['image/x-nikon-nef'], category: 'image', maxSize: 100 * 1024 * 1024 },
  arw: { format: 'arw', label: 'ARW', mimeTypes: ['image/x-sony-arw'], category: 'image', maxSize: 100 * 1024 * 1024 },
  dng: { format: 'dng', label: 'DNG', mimeTypes: ['image/x-adobe-dng'], category: 'image', maxSize: 100 * 1024 * 1024 },

  // ===== AUDIO =====
  mp3: { format: 'mp3', label: 'MP3', mimeTypes: ['audio/mpeg'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  wav: { format: 'wav', label: 'WAV', mimeTypes: ['audio/wav', 'audio/wave'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  ogg: { format: 'ogg', label: 'OGG', mimeTypes: ['audio/ogg'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  m4a: { format: 'm4a', label: 'M4A', mimeTypes: ['audio/mp4', 'audio/m4a'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  flac: { format: 'flac', label: 'FLAC', mimeTypes: ['audio/flac'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  aac: { format: 'aac', label: 'AAC', mimeTypes: ['audio/aac'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  aiff: { format: 'aiff', label: 'AIFF', mimeTypes: ['audio/aiff', 'audio/x-aiff'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  aif: { format: 'aif', label: 'AIF', mimeTypes: ['audio/aiff', 'audio/x-aiff'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  wma: { format: 'wma', label: 'WMA', mimeTypes: ['audio/x-ms-wma'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  opus: { format: 'opus', label: 'OPUS', mimeTypes: ['audio/opus'], category: 'audio', maxSize: 50 * 1024 * 1024 },
  amr: { format: 'amr', label: 'AMR', mimeTypes: ['audio/amr'], category: 'audio', maxSize: 20 * 1024 * 1024 },
  wv: { format: 'wv', label: 'WavPack', mimeTypes: ['audio/x-wavpack'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  alac: { format: 'alac', label: 'ALAC', mimeTypes: ['audio/x-alac'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  ape: { format: 'ape', label: 'APE', mimeTypes: ['audio/ape', 'audio/x-ape'], category: 'audio', maxSize: 100 * 1024 * 1024 },
  mpc: { format: 'mpc', label: 'Musepack', mimeTypes: ['audio/x-musepack'], category: 'audio', maxSize: 100 * 1024 * 1024 },

  // ===== VIDEO =====
  mp4: { format: 'mp4', label: 'MP4', mimeTypes: ['video/mp4'], category: 'video', maxSize: 500 * 1024 * 1024 },
  webm: { format: 'webm', label: 'WebM', mimeTypes: ['video/webm'], category: 'video', maxSize: 500 * 1024 * 1024 },
  mkv: { format: 'mkv', label: 'MKV', mimeTypes: ['video/x-matroska'], category: 'video', maxSize: 500 * 1024 * 1024 },
  avi: { format: 'avi', label: 'AVI', mimeTypes: ['video/x-msvideo'], category: 'video', maxSize: 500 * 1024 * 1024 },
  mov: { format: 'mov', label: 'MOV', mimeTypes: ['video/quicktime'], category: 'video', maxSize: 500 * 1024 * 1024 },
  flv: { format: 'flv', label: 'FLV', mimeTypes: ['video/x-flv'], category: 'video', maxSize: 300 * 1024 * 1024 },
  wmv: { format: 'wmv', label: 'WMV', mimeTypes: ['video/x-ms-wmv'], category: 'video', maxSize: 500 * 1024 * 1024 },
  mpeg: { format: 'mpeg', label: 'MPEG', mimeTypes: ['video/mpeg'], category: 'video', maxSize: 500 * 1024 * 1024 },
  mpg: { format: 'mpg', label: 'MPG', mimeTypes: ['video/mpeg'], category: 'video', maxSize: 500 * 1024 * 1024 },
  m4v: { format: 'm4v', label: 'M4V', mimeTypes: ['video/x-m4v'], category: 'video', maxSize: 500 * 1024 * 1024 },
  vob: { format: 'vob', label: 'VOB', mimeTypes: ['video/dvd'], category: 'video', maxSize: 1024 * 1024 * 1024 },
  ts: { format: 'ts', label: 'TS', mimeTypes: ['video/mp2t'], category: 'video', maxSize: 500 * 1024 * 1024 },
  '3gp': { format: '3gp', label: '3GP', mimeTypes: ['video/3gpp'], category: 'video', maxSize: 200 * 1024 * 1024 },
  ogv: { format: 'ogv', label: 'OGV', mimeTypes: ['video/ogg'], category: 'video', maxSize: 500 * 1024 * 1024 },
  f4v: { format: 'f4v', label: 'F4V', mimeTypes: ['video/x-f4v'], category: 'video', maxSize: 500 * 1024 * 1024 },
  swf: { format: 'swf', label: 'SWF', mimeTypes: ['application/x-shockwave-flash'], category: 'video', maxSize: 300 * 1024 * 1024 },
  mts: { format: 'mts', label: 'MTS', mimeTypes: ['video/mp2t'], category: 'video', maxSize: 1024 * 1024 * 1024 },

  // ===== DOCUMENTS =====
  pdf: { format: 'pdf', label: 'PDF', mimeTypes: ['application/pdf'], category: 'document', maxSize: 100 * 1024 * 1024 },
  docx: { format: 'docx', label: 'DOCX', mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], category: 'document', maxSize: 100 * 1024 * 1024 },
  doc: { format: 'doc', label: 'DOC', mimeTypes: ['application/msword'], category: 'document', maxSize: 100 * 1024 * 1024 },
  odt: { format: 'odt', label: 'ODT', mimeTypes: ['application/vnd.oasis.opendocument.text'], category: 'document', maxSize: 100 * 1024 * 1024 },
  rtf: { format: 'rtf', label: 'RTF', mimeTypes: ['application/rtf', 'text/rtf'], category: 'document', maxSize: 50 * 1024 * 1024 },
  txt: { format: 'txt', label: 'TXT', mimeTypes: ['text/plain'], category: 'document', maxSize: 20 * 1024 * 1024 },
  epub: { format: 'epub', label: 'EPUB', mimeTypes: ['application/epub+zip'], category: 'document', maxSize: 100 * 1024 * 1024 },
  mobi: { format: 'mobi', label: 'MOBI', mimeTypes: ['application/x-mobipocket-ebook'], category: 'document', maxSize: 100 * 1024 * 1024 },
  azw: { format: 'azw', label: 'AZW', mimeTypes: ['application/vnd.amazon.ebook'], category: 'document', maxSize: 100 * 1024 * 1024 },
  azw3: { format: 'azw3', label: 'AZW3', mimeTypes: ['application/vnd.amazon.ebook'], category: 'document', maxSize: 100 * 1024 * 1024 },
  html: { format: 'html', label: 'HTML', mimeTypes: ['text/html'], category: 'document', maxSize: 20 * 1024 * 1024 },
  xml: { format: 'xml', label: 'XML', mimeTypes: ['application/xml', 'text/xml'], category: 'document', maxSize: 30 * 1024 * 1024 },
  json: { format: 'json', label: 'JSON', mimeTypes: ['application/json'], category: 'document', maxSize: 30 * 1024 * 1024 },
  yaml: { format: 'yaml', label: 'YAML', mimeTypes: ['application/x-yaml', 'text/yaml'], category: 'document', maxSize: 20 * 1024 * 1024 },
  csv: { format: 'csv', label: 'CSV', mimeTypes: ['text/csv'], category: 'document', maxSize: 50 * 1024 * 1024 },
  xlsx: { format: 'xlsx', label: 'XLSX', mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], category: 'document', maxSize: 100 * 1024 * 1024 },
  xls: { format: 'xls', label: 'XLS', mimeTypes: ['application/vnd.ms-excel'], category: 'document', maxSize: 100 * 1024 * 1024 },
  pptx: { format: 'pptx', label: 'PPTX', mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'], category: 'document', maxSize: 150 * 1024 * 1024 },
  ppt: { format: 'ppt', label: 'PPT', mimeTypes: ['application/vnd.ms-powerpoint'], category: 'document', maxSize: 150 * 1024 * 1024 },
  odp: { format: 'odp', label: 'ODP', mimeTypes: ['application/vnd.oasis.opendocument.presentation'], category: 'document', maxSize: 150 * 1024 * 1024 },
  ods: { format: 'ods', label: 'ODS', mimeTypes: ['application/vnd.oasis.opendocument.spreadsheet'], category: 'document', maxSize: 100 * 1024 * 1024 },

  // ===== ARCHIVES =====
  zip: { format: 'zip', label: 'ZIP', mimeTypes: ['application/zip'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  rar: { format: 'rar', label: 'RAR', mimeTypes: ['application/x-rar-compressed', 'application/vnd.rar'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  '7z': { format: '7z', label: '7Z', mimeTypes: ['application/x-7z-compressed'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  tar: { format: 'tar', label: 'TAR', mimeTypes: ['application/x-tar'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  gz: { format: 'gz', label: 'GZIP', mimeTypes: ['application/gzip'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  bz2: { format: 'bz2', label: 'BZ2', mimeTypes: ['application/x-bzip2'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  xz: { format: 'xz', label: 'XZ', mimeTypes: ['application/x-xz'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  tgz: { format: 'tgz', label: 'TGZ', mimeTypes: ['application/x-compressed-tar'], category: 'archive', maxSize: 500 * 1024 * 1024 },
  zst: { format: 'zst', label: 'Zstandard', mimeTypes: ['application/zstd'], category: 'archive', maxSize: 500 * 1024 * 1024 },
}

export const CONVERSION_CONFIG: ConversionConfig = {
  image: {
    formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'avif', 'ico', 'tiff', 'tif', 'heic', 'heif', 'eps', 'psd', 'dds', 'tga', 'raw', 'cr2', 'nef', 'arw', 'dng'],
    conversions: {
      jpg: ['png', 'webp', 'gif', 'bmp', 'avif', 'ico', 'tiff', 'tif', 'heic', 'heif', 'tga'],
      jpeg: ['png', 'webp', 'gif', 'bmp', 'avif', 'ico', 'tiff', 'tif', 'heic', 'heif', 'tga'],
      png: ['jpg', 'jpeg', 'webp', 'gif', 'bmp', 'avif', 'ico', 'tiff', 'tif', 'heic', 'heif', 'tga'],
      webp: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'avif', 'ico', 'tiff', 'tif', 'tga'],
      gif: ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'ico', 'tiff', 'tif'],
      bmp: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'ico', 'tiff', 'tif', 'tga'],
      svg: ['png', 'jpg', 'jpeg', 'webp', 'avif', 'ico', 'tiff'],
      avif: ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'ico', 'tiff', 'tif'],
      ico: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'],
      tiff: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif', 'ico', 'tif', 'tga', 'dng'],
      tif: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif', 'ico', 'tiff', 'tga', 'dng'],
      heic: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'tif', 'heif'],
      heif: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'tif', 'heic'],
      eps: ['png', 'jpg', 'jpeg'],
      psd: ['png', 'jpg', 'jpeg', 'tiff', 'bmp'],
      dds: ['png', 'jpg', 'jpeg', 'tga', 'bmp'],
      tga: ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif'],
      raw: ['jpg', 'jpeg', 'png', 'tiff', 'dng'],
      cr2: ['jpg', 'jpeg', 'png', 'tiff', 'dng'],
      nef: ['jpg', 'jpeg', 'png', 'tiff', 'dng'],
      arw: ['jpg', 'jpeg', 'png', 'tiff', 'dng'],
      dng: ['jpg', 'jpeg', 'png', 'tiff'],
    },
    maxSize: 100 * 1024 * 1024,
  },
  audio: {
    formats: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'aiff', 'aif', 'wma', 'opus', 'amr', 'wv', 'alac', 'ape', 'mpc'],
    conversions: {
      mp3: ['wav', 'ogg', 'm4a', 'flac', 'aac', 'aiff', 'aif', 'wma', 'opus'],
      wav: ['mp3', 'ogg', 'm4a', 'flac', 'aac', 'aiff', 'aif', 'wma', 'opus', 'alac'],
      ogg: ['mp3', 'wav', 'm4a', 'flac', 'aac', 'aiff', 'wma', 'opus'],
      m4a: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'aiff', 'wma', 'opus', 'alac'],
      flac: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'aiff', 'aif', 'wma', 'opus', 'alac', 'ape'],
      aac: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aiff', 'wma', 'opus'],
      aiff: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'aif', 'wma', 'opus', 'alac'],
      aif: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'aiff', 'wma', 'opus', 'alac'],
      wma: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'aiff', 'opus'],
      opus: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'aiff'],
      amr: ['mp3', 'wav', 'ogg', 'aac'],
      wv: ['wav', 'flac', 'mp3', 'ogg'],
      alac: ['flac', 'wav', 'aiff', 'mp3', 'm4a'],
      ape: ['flac', 'wav', 'mp3'],
      mpc: ['mp3', 'wav', 'flac'],
    },
    maxSize: 100 * 1024 * 1024,
  },
  video: {
    formats: ['mp4', 'webm', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v', 'vob', 'ts', '3gp', 'ogv', 'f4v', 'swf', 'mts'],
    conversions: {
      mp4: ['webm', 'mkv', 'avi', 'mov', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v', 'ts', '3gp', 'ogv'],
      webm: ['mp4', 'mkv', 'avi', 'mov', 'flv', 'mpeg', 'mpg', 'ogv'],
      mkv: ['mp4', 'webm', 'avi', 'mov', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v'],
      avi: ['mp4', 'webm', 'mkv', 'mov', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v'],
      mov: ['mp4', 'webm', 'mkv', 'avi', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v'],
      flv: ['mp4', 'webm', 'mkv', 'avi', 'mov', 'mpeg', 'mpg', 'f4v'],
      wmv: ['mp4', 'mkv', 'avi', 'mov', 'mpeg', 'mpg'],
      mpeg: ['mp4', 'webm', 'mkv', 'avi', 'mov', 'mpg', 'm4v'],
      mpg: ['mp4', 'webm', 'mkv', 'avi', 'mov', 'mpeg', 'm4v'],
      m4v: ['mp4', 'mkv', 'avi', 'mov', 'mpeg', 'mpg'],
      vob: ['mp4', 'mkv', 'avi', 'mpeg', 'mpg', 'ts'],
      ts: ['mp4', 'mkv', 'webm', 'mpeg', 'mpg', 'mts'],
      '3gp': ['mp4', 'avi', 'mov', 'webm'],
      ogv: ['mp4', 'webm', 'mkv', 'avi'],
      f4v: ['mp4', 'flv', 'avi', 'mkv'],
      swf: ['mp4', 'flv'],
      mts: ['mp4', 'mkv', 'avi', 'ts'],
    },
    maxSize: 1024 * 1024 * 1024,
  },
  document: {
    formats: ['pdf', 'docx', 'doc', 'odt', 'rtf', 'txt', 'epub', 'mobi', 'azw', 'azw3', 'html', 'xml', 'json', 'yaml', 'csv', 'xlsx', 'xls', 'pptx', 'ppt', 'odp', 'ods'],
    conversions: {
      pdf: ['txt', 'html', 'docx', 'doc', 'odt', 'rtf', 'epub'],
      docx: ['pdf', 'txt', 'html', 'odt', 'rtf', 'doc', 'epub'],
      doc: ['docx', 'pdf', 'txt', 'html', 'odt', 'rtf'],
      odt: ['pdf', 'docx', 'doc', 'txt', 'html', 'rtf'],
      rtf: ['pdf', 'docx', 'doc', 'odt', 'txt', 'html'],
      txt: ['pdf', 'html', 'docx', 'doc', 'odt', 'rtf', 'epub'],
      epub: ['pdf', 'txt', 'html', 'mobi', 'azw', 'azw3'],
      mobi: ['epub', 'pdf', 'txt', 'html', 'azw', 'azw3'],
      azw: ['epub', 'mobi', 'pdf', 'txt', 'html', 'azw3'],
      azw3: ['epub', 'mobi', 'azw', 'pdf', 'txt', 'html'],
      html: ['pdf', 'txt', 'docx', 'doc', 'odt', 'epub'],
      xml: ['json', 'yaml', 'txt', 'html', 'csv'],
      json: ['xml', 'yaml', 'csv', 'txt', 'html'],
      yaml: ['json', 'xml', 'txt', 'html'],
      csv: ['json', 'txt', 'html', 'xlsx', 'xls'],
      xlsx: ['csv', 'xls', 'pdf', 'html', 'txt', 'ods'],
      xls: ['xlsx', 'csv', 'pdf', 'html', 'txt', 'ods'],
      pptx: ['pdf', 'html', 'txt', 'ppt', 'odp'],
      ppt: ['pptx', 'pdf', 'html', 'txt', 'odp'],
      odp: ['pptx', 'ppt', 'pdf', 'html', 'txt'],
      ods: ['xlsx', 'xls', 'csv', 'pdf', 'html', 'txt'],
    },
    maxSize: 150 * 1024 * 1024,
  },
  archive: {
    formats: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'tgz', 'zst'],
    conversions: {
      zip: ['tar', 'gz', 'bz2', 'xz', '7z', 'tgz'],
      rar: ['zip', 'tar', '7z'],
      '7z': ['zip', 'tar', 'gz'],
      tar: ['zip', 'gz', 'bz2', 'xz', '7z', 'tgz'],
      gz: ['zip', 'tar', 'bz2', 'xz', 'tgz'],
      bz2: ['zip', 'tar', 'gz', 'xz'],
      xz: ['zip', 'tar', 'gz', 'bz2'],
      tgz: ['zip', 'tar', 'gz', 'bz2'],
      zst: ['zip', 'tar', 'gz'],
    },
    maxSize: 1024 * 1024 * 1024,
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
