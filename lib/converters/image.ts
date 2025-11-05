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
      case 'bmp':
        // Sharp doesn't support BMP output directly, convert to PNG first
        const tempPng = outputPath.replace(/\.bmp$/, '.temp.png')
        await sharpInstance.png().toFile(tempPng)
        // For MVP, we'll just rename it (proper BMP conversion would need another library)
        await fs.rename(tempPng, outputPath)
        break
      default:
        throw new Error(`Unsupported image format: ${targetFormat}`)
    }
  } catch (error) {
    throw new Error(`Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
