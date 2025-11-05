import { DocumentFormat } from '@/types/formats'
import fs from 'fs/promises'

export async function convertDocument(
  inputPath: string,
  outputPath: string,
  sourceFormat: DocumentFormat,
  targetFormat: DocumentFormat
): Promise<void> {
  try {
    // Basic text-based conversions for MVP
    if (sourceFormat === 'txt' && targetFormat === 'md') {
      const content = await fs.readFile(inputPath, 'utf-8')
      await fs.writeFile(outputPath, content, 'utf-8')
    } else if (sourceFormat === 'md' && targetFormat === 'txt') {
      const content = await fs.readFile(inputPath, 'utf-8')
      // Simple markdown to text conversion (strip markdown syntax)
      const plainText = content
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
        .replace(/`(.*?)`/g, '$1') // Remove inline code
      await fs.writeFile(outputPath, plainText, 'utf-8')
    } else {
      throw new Error(`Document conversion from ${sourceFormat} to ${targetFormat} is not yet supported in MVP`)
    }
  } catch (error) {
    throw new Error(`Document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
