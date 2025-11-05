import { VideoFormat } from '@/types/formats'

export async function convertVideo(
  inputPath: string,
  outputPath: string,
  targetFormat: VideoFormat,
  onProgress?: (percent: number) => void
): Promise<void> {
  // Lazy load FFmpeg only when needed
  const ffmpeg = (await import('fluent-ffmpeg')).default
  const ffmpegInstaller = (await import('@ffmpeg-installer/ffmpeg')).default

  ffmpeg.setFfmpegPath(ffmpegInstaller.path)

  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(inputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg video command:', commandLine)
        })

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
        case 'flv':
          command = command
            .videoCodec('flv')
            .audioCodec('libmp3lame')
          break
        case 'wmv':
          command = command
            .videoCodec('wmv2')
            .audioCodec('wmav2')
          break
        case 'mpeg':
        case 'mpg':
          command = command
            .videoCodec('mpeg2video')
            .audioCodec('mp2')
          break
        case 'm4v':
          command = command
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-preset', 'medium', '-crf', '23'])
          break
        case 'vob':
          command = command
            .videoCodec('mpeg2video')
            .audioCodec('mp2')
          break
        case 'ts':
          command = command
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-f', 'mpegts'])
          break
        case '3gp':
          command = command
            .videoCodec('h263')
            .audioCodec('aac')
            .outputOptions(['-s', '176x144'])
          break
        case 'ogv':
          command = command
            .videoCodec('libtheora')
            .audioCodec('libvorbis')
          break
        case 'f4v':
          command = command
            .videoCodec('libx264')
            .audioCodec('aac')
          break
        case 'swf':
          command = command
            .videoCodec('flv')
            .audioCodec('libmp3lame')
          break
        case 'mts':
          command = command
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-f', 'mpegts'])
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
          if (progress.percent) {
            console.log(`Video processing: ${Math.round(progress.percent)}%`)
          }
        })
        .on('end', () => {
          console.log('Video conversion completed successfully')
          resolve()
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg video error:', err.message)
          console.error('FFmpeg stderr:', stderr)
          reject(new Error(`Video conversion failed: ${err.message}. Check if the format and codecs are supported by your FFmpeg installation.`))
        })
        .run()
    } catch (error) {
      reject(new Error(`Video conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}
