import sharp from 'sharp'
import { ImageFormat } from '@/types/formats'
import path from 'path'
import fs from 'fs/promises'

export async function convertImage(
  inputPath: string,
  outputPath: string,
  targetFormat: ImageFormat
): Promise<void> {
  try {
    let sharpInstance = sharp(inputPath)

    // Handle different format conversions
    switch (targetFormat) {
      case 'jpg':
      case 'jpeg':
        await sharpInstance.jpeg({ quality: 90 }).toFile(outputPath)
        break
      case 'png':
        await sharpInstance.png({ quality: 90 }).toFile(outputPath)
        break
      case 'webp':
        await sharpInstance.webp({ quality: 90 }).toFile(outputPath)
        break
      case 'avif':
        await sharpInstance.avif({ quality: 90 }).toFile(outputPath)
        break
      case 'gif':
        await sharpInstance.gif().toFile(outputPath)
        break
      case 'heic':
      case 'heif':
        await sharpInstance.heif({ quality: 90 }).toFile(outputPath)
        break
      case 'tiff':
      case 'tif':
        await sharpInstance.tiff({ quality: 90 }).toFile(outputPath)
        break
      case 'ico':
        // For ICO, resize to common icon sizes and save as PNG (browsers accept PNG as ICO)
        await sharpInstance.resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(outputPath)
        break
      case 'bmp':
      case 'tga':
      case 'dds':
        // Sharp doesn't support BMP/TGA/DDS output directly, convert to PNG
        await sharpInstance.png().toFile(outputPath)
        break
      case 'psd':
      case 'eps':
        // PSD and EPS are complex formats, convert to high-quality PNG
        await sharpInstance.png({ quality: 100, compressionLevel: 0 }).toFile(outputPath)
        break
      default:
        throw new Error(`Unsupported image format: ${targetFormat}`)
    }
  } catch (error) {
    throw new Error(`Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
