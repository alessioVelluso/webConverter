import { ArchiveFormat } from '@/types/formats'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import os from 'os'

export async function convertArchive(
  inputPath: string,
  outputPath: string,
  sourceFormat: ArchiveFormat,
  targetFormat: ArchiveFormat
): Promise<void> {
  console.log(`Converting archive from ${sourceFormat} to ${targetFormat}`)

  try {
    // Create temporary directory for extraction
    const tempDir = path.join(os.tmpdir(), `archive-conversion-${Date.now()}`)
    await fsPromises.mkdir(tempDir, { recursive: true })

    try {
      // Step 1: Extract source archive
      await extractArchive(inputPath, tempDir, sourceFormat)

      // Step 2: Create target archive
      await createArchive(tempDir, outputPath, targetFormat)

      console.log('Archive conversion completed successfully')
    } finally {
      // Cleanup: remove temporary directory
      try {
        await fsPromises.rm(tempDir, { recursive: true, force: true })
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp directory:', cleanupError)
      }
    }
  } catch (error) {
    console.error('Archive conversion error:', error)
    throw new Error(`Archive conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Extract archive to directory
async function extractArchive(archivePath: string, targetDir: string, format: ArchiveFormat): Promise<void> {
  console.log(`Extracting ${format} archive...`)

  switch (format) {
    case 'zip':
      await extractZip(archivePath, targetDir)
      break
    case 'tar':
      await extractTar(archivePath, targetDir, 'none')
      break
    case 'tgz':
      await extractTar(archivePath, targetDir, 'gzip')
      break
    case 'gz':
      await extractGzip(archivePath, targetDir)
      break
    case 'bz2':
      throw new Error('BZ2 extraction requires external bzip2 tool. Please convert to ZIP or TAR.GZ.')
    case 'xz':
      throw new Error('XZ extraction requires external xz-utils. Please convert to ZIP or TAR.GZ.')
      break
    case '7z':
      // 7z requires external tool, fallback to ZIP
      throw new Error('7z extraction requires 7-Zip tool. Please convert to ZIP first.')
    case 'rar':
      // RAR is proprietary, requires external tool
      throw new Error('RAR extraction requires WinRAR or unrar tool. Please convert to ZIP first.')
    case 'zst':
      throw new Error('Zstandard extraction not yet supported. Please use ZIP or TAR.GZ.')
    default:
      throw new Error(`Unsupported archive format for extraction: ${format}`)
  }
}

// Create archive from directory
async function createArchive(sourceDir: string, outputPath: string, format: ArchiveFormat): Promise<void> {
  console.log(`Creating ${format} archive...`)

  switch (format) {
    case 'zip':
      await createZip(sourceDir, outputPath)
      break
    case 'tar':
      await createTar(sourceDir, outputPath, 'none')
      break
    case 'tgz':
      await createTar(sourceDir, outputPath, 'gzip')
      break
    case 'gz':
      await createGzip(sourceDir, outputPath)
      break
    case 'bz2':
      throw new Error('BZ2 creation requires external bzip2 tool. Please use ZIP or TAR.GZ format.')
    case 'xz':
      throw new Error('XZ creation requires external xz-utils. Please use ZIP or TAR.GZ format.')
      break
    case '7z':
      throw new Error('7z creation requires 7-Zip tool. Please use ZIP format instead.')
    case 'rar':
      throw new Error('RAR creation requires WinRAR tool. Please use ZIP format instead.')
    case 'zst':
      throw new Error('Zstandard creation not yet supported. Please use ZIP or TAR.GZ.')
    default:
      throw new Error(`Unsupported archive format for creation: ${format}`)
  }
}

// ZIP operations
async function extractZip(archivePath: string, targetDir: string): Promise<void> {
  const AdmZip = (await import('adm-zip')).default
  const zip = new AdmZip(archivePath)
  zip.extractAllTo(targetDir, true)
}

async function createZip(sourceDir: string, outputPath: string): Promise<void> {
  const AdmZip = (await import('adm-zip')).default
  const zip = new AdmZip()

  // Add all files and subdirectories
  const addDirectory = async (dirPath: string, zipPath: string = '') => {
    const entries = await fsPromises.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      const zipEntryPath = zipPath ? `${zipPath}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        zip.addFile(`${zipEntryPath}/`, Buffer.alloc(0))
        await addDirectory(fullPath, zipEntryPath)
      } else {
        const fileBuffer = await fsPromises.readFile(fullPath)
        zip.addFile(zipEntryPath, fileBuffer)
      }
    }
  }

  await addDirectory(sourceDir)
  zip.writeZip(outputPath)
  console.log(`ZIP archive created: ${outputPath}`)
}

// TAR operations
async function extractTar(archivePath: string, targetDir: string, compression: 'none' | 'gzip'): Promise<void> {
  const tar = await import('tar-fs')
  const zlib = await import('zlib')
  const stream = fs.createReadStream(archivePath)

  return new Promise((resolve, reject) => {
    const extract = tar.extract(targetDir)

    if (compression === 'gzip') {
      stream
        .pipe(zlib.createGunzip())
        .pipe(extract)
        .on('finish', () => resolve())
        .on('error', (err) => reject(err))
    } else {
      stream
        .pipe(extract)
        .on('finish', () => resolve())
        .on('error', (err) => reject(err))
    }
  })
}

async function createTar(sourceDir: string, outputPath: string, compression: 'none' | 'gzip'): Promise<void> {
  const tar = await import('tar-fs')
  const zlib = await import('zlib')
  const output = fs.createWriteStream(outputPath)

  return new Promise((resolve, reject) => {
    const pack = tar.pack(sourceDir)

    if (compression === 'gzip') {
      pack
        .pipe(zlib.createGzip())
        .pipe(output)
        .on('finish', () => {
          console.log('TAR.GZ archive created')
          resolve()
        })
        .on('error', (err) => reject(err))
    } else {
      pack
        .pipe(output)
        .on('finish', () => {
          console.log('TAR archive created')
          resolve()
        })
        .on('error', (err) => reject(err))
    }
  })
}

// GZIP operations (for single files)
async function extractGzip(archivePath: string, targetDir: string): Promise<void> {
  const zlib = await import('zlib')
  const stream = fs.createReadStream(archivePath)
  const basename = path.basename(archivePath, '.gz')
  const outputPath = path.join(targetDir, basename)
  const output = fs.createWriteStream(outputPath)

  return new Promise((resolve, reject) => {
    stream
      .pipe(zlib.createGunzip())
      .pipe(output)
      .on('finish', () => resolve())
      .on('error', (err) => reject(err))
  })
}

async function createGzip(sourceDir: string, outputPath: string): Promise<void> {
  const zlib = await import('zlib')

  // For GZIP, we need to compress a single file or create a TAR first
  // Get first file in directory
  const files = await fsPromises.readdir(sourceDir)
  if (files.length === 0) {
    throw new Error('No files to compress')
  }

  const inputPath = path.join(sourceDir, files[0])
  const input = fs.createReadStream(inputPath)
  const output = fs.createWriteStream(outputPath)

  return new Promise((resolve, reject) => {
    input
      .pipe(zlib.createGzip())
      .pipe(output)
      .on('finish', () => resolve())
      .on('error', (err) => reject(err))
  })
}

