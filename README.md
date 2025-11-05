# File Converter Web Application

A universal file converter built with Next.js 15, TypeScript, and React. Convert files between multiple formats including images, audio, video, documents, and archives.

## Features

- **Multi-Format Support**: Convert between various file formats
  - Images: JPG, PNG, WebP, GIF, BMP, SVG, AVIF
  - Audio: MP3, WAV, OGG, M4A, FLAC, AAC
  - Video: MP4, WebM, MKV, AVI, MOV
  - Documents: PDF, DOCX, TXT, MD
  - Archives: ZIP, TAR, GZ

- **User-Friendly Interface**
  - Clean, modern design
  - Drag-and-drop file upload
  - Real-time progress tracking
  - Responsive design for all devices

- **Robust Processing**
  - Client-side file validation
  - Server-side conversion using industry-standard libraries
  - Automatic file cleanup
  - Error handling with meaningful messages

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp
- **Audio/Video Processing**: FFmpeg
- **File Handling**: Node.js File System

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd webConverter
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select Category**: Choose the type of file you want to convert (Image, Audio, Video, Document, Archive)
2. **Select Formats**: Choose your source format and desired target format
3. **Upload File**: Drag and drop your file or click to browse
4. **Convert**: Click the convert button and wait for processing
5. **Download**: Download your converted file

## File Size Limits

- Images: 10 MB
- Audio: 100 MB
- Video: 200 MB
- Documents: 20 MB
- Archives: 100 MB

## API Routes

### POST /api/cleanup
Manually trigger cleanup of old temporary files

## Project Structure

```
webConverter/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── CategorySelector.tsx
│   ├── FormatSelector.tsx
│   ├── FileUpload.tsx
│   └── ProgressBar.tsx
├── lib/                   # Libraries and utilities
│   ├── converters/       # Format-specific converters
│   └── formats.ts        # Format configuration
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── actions/              # Server actions
```

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
