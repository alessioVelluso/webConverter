import { NextResponse } from 'next/server'
import { cleanupOldFiles } from '@/utils/fileSystem'

export async function POST() {
  try {
    await cleanupOldFiles(1) // Clean files older than 1 hour for testing
    return NextResponse.json({ success: true, message: 'Cleanup completed' })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await cleanupOldFiles(24) // Clean files older than 24 hours
    return NextResponse.json({ success: true, message: 'Cleanup completed' })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}
