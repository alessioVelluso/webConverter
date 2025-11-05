import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { AudioFormat } from '@/types/formats'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

export async function convertAudio(
  inputPath: string,
  outputPath: string,
  targetFormat: AudioFormat
): Promise<void> {
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
