import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { VideoFormat } from '@/types/formats'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

export async function convertVideo(
  inputPath: string,
  outputPath: string,
  targetFormat: VideoFormat,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(inputPath)

      // Set output format and codec options based on target format
      switch (targetFormat) {
        case 'mp4':
          command = command
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-preset', 'medium', '-crf', '23'])
          break
        case 'webm':
          command = command
            .videoCodec('libvpx-vp9')
            .audioCodec('libopus')
            .outputOptions(['-crf', '30', '-b:v', '0'])
          break
        case 'mkv':
          command = command
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-preset', 'medium', '-crf', '23'])
          break
        case 'avi':
          command = command
            .videoCodec('mpeg4')
            .audioCodec('libmp3lame')
          break
        case 'mov':
          command = command
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-preset', 'medium', '-crf', '23'])
          break
        default:
          throw new Error(`Unsupported video format: ${targetFormat}`)
      }

      command
        .output(outputPath)
        .on('progress', (progress) => {
          if (onProgress && progress.percent) {
            onProgress(progress.percent)
          }
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(new Error(`Video conversion failed: ${err.message}`)))
        .run()
    } catch (error) {
      reject(new Error(`Video conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}
