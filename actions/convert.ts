'use server'

import { FileFormat, ConversionResult, ImageFormat, AudioFormat, VideoFormat, DocumentFormat, ArchiveFormat } from '@/types/formats'
import { FORMAT_INFO, isConversionSupported } from '@/lib/formats'
import { saveUploadedFile, generateOutputPath, deleteFile, readFileAsBuffer, getFileStats } from '@/utils/fileSystem'
import { convertImage } from '@/lib/converters/image'
import { convertAudio } from '@/lib/converters/audio'
import { convertVideo } from '@/lib/converters/video'
import { convertDocument } from '@/lib/converters/document'
import { convertArchive } from '@/lib/converters/archive'
import path from 'path'

export async function convertFile(
  formData: FormData
): Promise<ConversionResult> {
  try {
    const file = formData.get('file') as File
    const sourceFormat = formData.get('sourceFormat') as FileFormat
    const targetFormat = formData.get('targetFormat') as FileFormat

    if (!file || !sourceFormat || !targetFormat) {
      return {
        success: false,
        error: 'Missing required parameters',
      }
    }

    // Validate conversion is supported
    if (!isConversionSupported(sourceFormat, targetFormat)) {
      return {
        success: false,
        error: `Conversion from ${sourceFormat} to ${targetFormat} is not supported`,
      }
    }

    // Save uploaded file
    const buffer = Buffer.from(await file.arrayBuffer())
    const inputPath = await saveUploadedFile(buffer, file.name)

    // Generate output path
    const outputPath = generateOutputPath(inputPath, targetFormat)

    try {
      // Perform conversion based on category
      const formatInfo = FORMAT_INFO[sourceFormat]
      const category = formatInfo.category

      switch (category) {
        case 'image':
          await convertImage(inputPath, outputPath, targetFormat as ImageFormat)
          break
        case 'audio':
          await convertAudio(inputPath, outputPath, targetFormat as AudioFormat)
          break
        case 'video':
          await convertVideo(inputPath, outputPath, targetFormat as VideoFormat)
          break
        case 'document':
          await convertDocument(inputPath, outputPath, sourceFormat as DocumentFormat, targetFormat as DocumentFormat)
          break
        case 'archive':
          await convertArchive(inputPath, outputPath, sourceFormat as ArchiveFormat, targetFormat as ArchiveFormat)
          break
        default:
          throw new Error(`Unsupported category: ${category}`)
      }

      // Get file stats
      const stats = await getFileStats(outputPath)
      const outputBuffer = await readFileAsBuffer(outputPath)

      // Clean up input file
      await deleteFile(inputPath)

      // Return the converted file as base64
      const base64 = outputBuffer.toString('base64')
      const fileName = path.basename(outputPath)

      // Clean up output file
      await deleteFile(outputPath)

      return {
        success: true,
        fileName,
        filePath: `data:application/octet-stream;base64,${base64}`,
        fileSize: stats.size,
      }
    } catch (conversionError) {
      // Clean up files on error
      await deleteFile(inputPath)
      throw conversionError
    }
  } catch (error) {
    console.error('Conversion error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Conversion failed',
    }
  }
}
