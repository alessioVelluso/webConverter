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

    // Handle different format conversions with REAL conversions (no fake extension changes!)
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
          console.error('AVIF not supported:', avifError)
          throw new Error('AVIF encoding not supported by your Sharp installation. Install libheif for AVIF support.')
        }
        break

      case 'tiff':
      case 'tif':
        await sharpInstance
          .tiff({ quality: 90, compression: 'lzw' })
          .toFile(outputPath)
        break

      case 'heic':
      case 'heif':
        try {
          await sharpInstance.heif({ quality: 90 }).toFile(outputPath)
        } catch (heifError) {
          console.error('HEIF not supported:', heifError)
          throw new Error('HEIF encoding not supported by your Sharp installation. Install libheif for HEIF support.')
        }
        break

      case 'ico':
        // REAL ICO conversion using png-to-ico
        await convertToIco(sharpInstance, outputPath)
        break

      case 'bmp':
        // REAL BMP conversion using bmp-js
        await convertToBmp(sharpInstance, outputPath)
        break

      case 'gif':
        // REAL GIF conversion using omggif
        await convertToGif(sharpInstance, outputPath)
        break

      case 'tga':
        // REAL TGA conversion
        await convertToTga(sharpInstance, outputPath)
        break

      case 'svg':
        // SVG is a vector format, cannot be created from raster
        throw new Error('Cannot convert raster images to SVG. SVG is a vector format that requires vectorization tools like Potrace or manual tracing.')

      case 'dds':
      case 'psd':
      case 'eps':
      case 'raw':
      case 'cr2':
      case 'nef':
      case 'arw':
      case 'dng':
        // These are highly specialized formats
        throw new Error(`${targetFormat.toUpperCase()} output requires specialized professional software. This format cannot be created with standard Node.js libraries. Consider using Adobe Photoshop, GIMP, RawTherapee, or Darktable for ${targetFormat.toUpperCase()} output.`)

      default:
        throw new Error(`Unsupported image format: ${targetFormat}`)
    }

    console.log(`Image conversion to ${targetFormat} completed successfully`)
  } catch (error) {
    console.error('Image conversion error:', error)
    throw new Error(`Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// REAL ICO conversion
async function convertToIco(sharpInstance: sharp.Sharp, outputPath: string): Promise<void> {
  try {
    const pngToIco = (await import('png-to-ico')).default

    // Generate multiple sizes for ICO (16, 32, 48, 64, 128, 256)
    const sizes = [16, 32, 48, 64, 128, 256]
    const pngBuffers: Buffer[] = []

    for (const size of sizes) {
      const buffer = await sharp(await sharpInstance.toBuffer())
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
      pngBuffers.push(buffer)
    }

    // Convert PNGs to ICO
    const icoBuffer = await pngToIco(pngBuffers)
    await fs.writeFile(outputPath, icoBuffer)
    console.log('ICO file created with multiple sizes:', sizes)
  } catch (error) {
    throw new Error(`ICO conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// REAL BMP conversion
async function convertToBmp(sharpInstance: sharp.Sharp, outputPath: string): Promise<void> {
  try {
    const bmp = await import('bmp-js')

    // Get raw image data
    const { data, info } = await sharpInstance
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Convert to BMP format
    const bmpData = {
      width: info.width,
      height: info.height,
      data: data
    }

    // Encode as BMP
    const rawBmpData = bmp.encode(bmpData)
    await fs.writeFile(outputPath, rawBmpData.data)
    console.log(`BMP file created: ${info.width}x${info.height}`)
  } catch (error) {
    throw new Error(`BMP conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// REAL GIF conversion
async function convertToGif(sharpInstance: sharp.Sharp, outputPath: string): Promise<void> {
  try {
    const { GifWriter } = await import('omggif')

    // Get raw image data
    const { data, info } = await sharpInstance
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const width = info.width
    const height = info.height

    // Create GIF
    const buf = Buffer.alloc(width * height * 4 * 2) // Allocate enough space
    const writer = new GifWriter(buf, width, height, { loop: 0 })

    // Convert RGBA to indexed color (simple palette)
    const indexedPixels = new Uint8Array(width * height)
    const palette: number[] = []
    const colorMap = new Map<string, number>()

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      // Simple color quantization (could be improved)
      const qR = Math.round(r / 51) * 51
      const qG = Math.round(g / 51) * 51
      const qB = Math.round(b / 51) * 51

      const colorKey = `${qR},${qG},${qB}`
      let colorIndex = colorMap.get(colorKey)

      if (colorIndex === undefined) {
        colorIndex = palette.length / 3
        if (colorIndex < 256) {
          palette.push(qR, qG, qB)
          colorMap.set(colorKey, colorIndex)
        } else {
          // Use closest color if palette is full
          colorIndex = 0
        }
      }

      indexedPixels[i / 4] = colorIndex
    }

    // Pad palette to 256 colors
    while (palette.length < 768) {
      palette.push(0)
    }

    // Add frame
    writer.addFrame(0, 0, width, height, Array.from(indexedPixels), { palette, delay: 0 })

    // Write file
    const gifLength = writer.end()
    await fs.writeFile(outputPath, buf.slice(0, gifLength))
    console.log(`GIF file created: ${width}x${height}`)
  } catch (error) {
    throw new Error(`GIF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// REAL TGA conversion
async function convertToTga(sharpInstance: sharp.Sharp, outputPath: string): Promise<void> {
  try {
    const TGA = (await import('tga')).default

    // Get raw image data
    const { data, info } = await sharpInstance
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const width = info.width
    const height = info.height

    // Create TGA file
    const tga = new TGA({
      width: width,
      height: height,
      pixels: data,
      isRLE: false // Uncompressed TGA
    })

    // Save TGA
    await fs.writeFile(outputPath, tga.data)
    console.log(`TGA file created: ${width}x${height}`)
  } catch (error) {
    throw new Error(`TGA conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
