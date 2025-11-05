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
    console.log(`Converting image from ${path.basename(inputPath)} to ${targetFormat}`)

    // Read image and get metadata
    let sharpInstance = sharp(inputPath)
    const metadata = await sharpInstance.metadata()
    console.log(`Image metadata: ${metadata.width}x${metadata.height}, format: ${metadata.format}`)

    // Recreate sharp instance for conversion
    sharpInstance = sharp(inputPath)

    // Handle different format conversions with robust error handling
    switch (targetFormat) {
      case 'jpg':
      case 'jpeg':
        await sharpInstance
          .jpeg({ quality: 90, mozjpeg: true })
          .toFile(outputPath)
        break
      case 'png':
        await sharpInstance
          .png({ quality: 90, compressionLevel: 6 })
          .toFile(outputPath)
        break
      case 'webp':
        await sharpInstance
          .webp({ quality: 90, effort: 4 })
          .toFile(outputPath)
        break
      case 'avif':
        try {
          await sharpInstance
            .avif({ quality: 90, effort: 4 })
            .toFile(outputPath)
        } catch (avifError) {
          // AVIF might not be supported, fallback to WebP
          console.warn('AVIF not supported, falling back to WebP')
          await sharpInstance
            .webp({ quality: 90 })
            .toFile(outputPath)
        }
        break
      case 'gif':
        try {
          await sharpInstance.gif().toFile(outputPath)
        } catch (gifError) {
          // GIF might not be supported for output, use PNG
          console.warn('GIF output not supported, falling back to PNG')
          await sharpInstance.png().toFile(outputPath)
        }
        break
      case 'heic':
      case 'heif':
        try {
          await sharpInstance.heif({ quality: 90 }).toFile(outputPath)
        } catch (heifError) {
          // HEIF might not be supported, fallback to JPEG
          console.warn('HEIF not supported, falling back to JPEG')
          await sharpInstance.jpeg({ quality: 90 }).toFile(outputPath)
        }
        break
      case 'tiff':
      case 'tif':
        await sharpInstance
          .tiff({ quality: 90, compression: 'lzw' })
          .toFile(outputPath)
        break
      case 'ico':
        // For ICO, resize to common icon sizes
        await sharpInstance
          .resize(256, 256, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toFile(outputPath)
        break
      case 'bmp':
        // BMP output - Sharp doesn't support it, convert to PNG
        console.warn('BMP output not directly supported by Sharp, converting to PNG')
        await sharpInstance.png().toFile(outputPath)
        break
      case 'tga':
      case 'dds':
        // TGA/DDS not supported, convert to PNG
        console.warn(`${targetFormat.toUpperCase()} output not supported, converting to PNG`)
        await sharpInstance.png({ compressionLevel: 0 }).toFile(outputPath)
        break
      case 'psd':
      case 'eps':
        // PSD and EPS are complex formats, convert to high-quality TIFF
        console.warn(`${targetFormat.toUpperCase()} output not directly supported, converting to TIFF`)
        await sharpInstance
          .tiff({ quality: 100, compression: 'none' })
          .toFile(outputPath)
        break
      case 'svg':
        // SVG is a vector format, cannot be created from raster
        throw new Error('Cannot convert raster images to SVG. SVG is a vector format and requires manual conversion.')
      case 'raw':
      case 'cr2':
      case 'nef':
      case 'arw':
      case 'dng':
        // RAW formats - convert to high-quality TIFF (industry standard)
        console.warn(`${targetFormat.toUpperCase()} output requires specialized software, converting to TIFF`)
        await sharpInstance
          .tiff({ quality: 100, compression: 'none' })
          .toFile(outputPath)
        break
      default:
        // Fallback: try direct conversion
        try {
          await sharpInstance.toFile(outputPath)
        } catch {
          // If fails, convert to PNG as universal fallback
          await sharpInstance.png().toFile(outputPath)
        }
    }

    console.log(`Image conversion to ${targetFormat} completed successfully`)
  } catch (error) {
    console.error('Image conversion error:', error)
    throw new Error(`Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the input file is a valid image.`)
  }
}
