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

      // Set output format and codec options
      switch (targetFormat) {
        case 'mp3':
          command = command.audioBitrate('192k').audioCodec('libmp3lame')
          break
        case 'wav':
          command = command.audioCodec('pcm_s16le')
          break
        case 'ogg':
          command = command.audioCodec('libvorbis').audioBitrate('192k')
          break
        case 'm4a':
          command = command.audioCodec('aac').audioBitrate('192k')
          break
        case 'flac':
          command = command.audioCodec('flac')
          break
        case 'aac':
          command = command.audioCodec('aac').audioBitrate('192k')
          break
        case 'aiff':
        case 'aif':
          command = command.audioCodec('pcm_s16be')
          break
        case 'wma':
          command = command.audioCodec('wmav2').audioBitrate('192k')
          break
        case 'opus':
          command = command.audioCodec('libopus').audioBitrate('128k')
          break
        case 'amr':
          command = command.audioCodec('libopencore_amrnb').audioBitrate('12.2k').audioChannels(1).audioFrequency(8000)
          break
        case 'wv':
          command = command.audioCodec('wavpack')
          break
        case 'alac':
          command = command.audioCodec('alac')
          break
        case 'ape':
          command = command.audioCodec('ape')
          break
        case 'mpc':
          command = command.audioCodec('musepack')
          break
        default:
          throw new Error(`Unsupported audio format: ${targetFormat}`)
      }

      command
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(new Error(`Audio conversion failed: ${err.message}`)))
        .run()
    } catch (error) {
      reject(new Error(`Audio conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}
