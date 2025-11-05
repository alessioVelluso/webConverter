import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'tmp', 'uploads')
const OUTPUT_DIR = path.join(process.cwd(), 'tmp', 'outputs')

export async function ensureDirectories(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
}

export async function saveUploadedFile(buffer: Buffer, filename: string): Promise<string> {
  await ensureDirectories()
  const uniqueId = randomUUID()
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  const uniqueFilename = `${name}-${uniqueId}${ext}`
  const filePath = path.join(UPLOAD_DIR, uniqueFilename)
  await fs.writeFile(filePath, buffer)
  return filePath
}

export function generateOutputPath(originalPath: string, targetExtension: string): string {
  const uniqueId = randomUUID()
  const name = path.basename(originalPath, path.extname(originalPath))
  const filename = `${name}-converted-${uniqueId}.${targetExtension}`
  return path.join(OUTPUT_DIR, filename)
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error)
  }
}

export async function readFileAsBuffer(filePath: string): Promise<Buffer> {
  return await fs.readFile(filePath)
}

export async function getFileStats(filePath: string) {
  return await fs.stat(filePath)
}

export async function cleanupOldFiles(maxAgeHours: number = 24): Promise<void> {
  const now = Date.now()
  const maxAge = maxAgeHours * 60 * 60 * 1000

  try {
    await ensureDirectories()

    // Clean upload directory
    const uploadFiles = await fs.readdir(UPLOAD_DIR)
    for (const file of uploadFiles) {
      const filePath = path.join(UPLOAD_DIR, file)
      const stats = await fs.stat(filePath)
      if (now - stats.mtimeMs > maxAge) {
        await deleteFile(filePath)
      }
    }

    // Clean output directory
    const outputFiles = await fs.readdir(OUTPUT_DIR)
    for (const file of outputFiles) {
      const filePath = path.join(OUTPUT_DIR, file)
      const stats = await fs.stat(filePath)
      if (now - stats.mtimeMs > maxAge) {
        await deleteFile(filePath)
      }
    }
  } catch (error) {
    console.error('Cleanup failed:', error)
  }
}
