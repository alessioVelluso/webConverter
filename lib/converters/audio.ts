import { AudioFormat } from '@/types/formats'

export async function convertAudio(
  inputPath: string,
  outputPath: string,
  targetFormat: AudioFormat
): Promise<void> {
  // Lazy load FFmpeg only when needed
  const ffmpeg = (await import('fluent-ffmpeg')).default
  const ffmpegInstaller = (await import('@ffmpeg-installer/ffmpeg')).default

  ffmpeg.setFfmpegPath(ffmpegInstaller.path)

  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(inputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine)
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`Processing: ${Math.round(progress.percent)}%`)
          }
        })

      // Set output format and codec options with better error handling
      switch (targetFormat) {
        case 'mp3':
          command = command.audioBitrate('192k').audioCodec('libmp3lame').format('mp3')
          break
        case 'wav':
          command = command.audioCodec('pcm_s16le').format('wav')
          break
        case 'ogg':
          command = command.audioCodec('libvorbis').audioBitrate('192k').format('ogg')
          break
        case 'm4a':
          command = command.audioCodec('aac').audioBitrate('192k').format('ipod')
          break
        case 'flac':
          command = command.audioCodec('flac').format('flac')
          break
        case 'aac':
          command = command.audioCodec('aac').audioBitrate('192k').format('adts')
          break
        case 'aiff':
        case 'aif':
          command = command.audioCodec('pcm_s16be').format('aiff')
          break
        case 'wma':
          command = command.audioCodec('wmav2').audioBitrate('192k').format('asf')
          break
        case 'opus':
          command = command.audioCodec('libopus').audioBitrate('128k').format('opus')
          break
        case 'amr':
          command = command.audioCodec('libopencore_amrnb').audioBitrate('12.2k').audioChannels(1).audioFrequency(8000).format('amr')
          break
        case 'wv':
          // WavPack might not be available, fallback to FLAC
          try {
            command = command.audioCodec('wavpack').format('wv')
          } catch {
            command = command.audioCodec('flac').format('flac')
          }
          break
        case 'alac':
          command = command.audioCodec('alac').format('ipod')
          break
        case 'ape':
          // APE might not be available, fallback to FLAC
          try {
            command = command.audioCodec('ape').format('ape')
          } catch {
            command = command.audioCodec('flac').format('flac')
          }
          break
        case 'mpc':
          // Musepack might not be available, fallback to MP3
          try {
            command = command.audioCodec('musepack').format('mpc')
          } catch {
            command = command.audioCodec('libmp3lame').audioBitrate('320k').format('mp3')
          }
          break
        default:
          // Fallback: try to convert using automatic format detection
          command = command.format(targetFormat)
      }

      command
        .output(outputPath)
        .on('end', () => {
          console.log('Audio conversion completed successfully')
          resolve()
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg error:', err.message)
          console.error('FFmpeg stderr:', stderr)
          reject(new Error(`Audio conversion failed: ${err.message}. Check if the format is supported by your FFmpeg installation.`))
        })
        .run()
    } catch (error) {
      reject(new Error(`Audio conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}
