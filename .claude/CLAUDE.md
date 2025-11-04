You are an expert full-stack TypeScript developer. I need you to build a universal file converter web application using Next.js 14+ with React and TypeScript.

## Requirements

### Functionality
- Landing page where users select a source file format from a comprehensive list (image, audio, video, document, archive formats)
- After selecting the source format, users choose a destination format (filtered to show only compatible conversions for that type)
- Drag-and-drop file upload with client-side validation (file type, size limits, MIME type)
- File conversion with a progress bar
- Download converted file
- No authentication, no database, no login system
- Minimal pages (landing + conversion flow all on one or two pages)

### Technical Stack
- Next.js 14+ with App Router
- React 18+
- TypeScript (strict mode)
- Tailwind CSS for styling
- File upload validation
- Progress tracking for conversions

### File Format Support (MVP)
- Images: JPG, PNG, WebP, GIF, BMP, SVG, AVIF
- Audio: MP3, WAV, OGG, M4A, FLAC, AAC
- Video: MP4, WebM, MKV, AVI, MOV
- Documents: PDF, DOCX, TXT, MD
- Archives: ZIP, RAR, 7Z, TAR, GZ

### Conversion Logic
- For lightweight conversions (images, basic audio): use client-side libraries (sharp, ffmpeg.wasm)
- For heavy conversions: implement server-side endpoints using appropriate libraries
- Return appropriate error messages if conversion fails
- Support streaming for large files

### UI/UX
- Clean, modern interface
- Clear file type icons and labels
- Drag-and-drop upload area
- Real-time progress bar during conversion
- Clear success/error states
- Responsive design (mobile-friendly)

### API Design
- POST /api/convert: Handle file upload and conversion
- GET /api/formats: Return supported formats and their conversions
- Proper error handling with meaningful error messages
- Support for multipart/form-data uploads

### Performance
- Client-side validation before upload
- File size restrictions with user-friendly messages
- Efficient conversion processes
- Cleanup of temporary files

### Structure
- Create a modular, maintainable codebase
- Separate concerns: API routes, components, utilities
- Reusable format configuration
- Type-safe format definitions

### Code Style
#### Function Declaration
- All React function parameters must be declared **on the same line** as the function signature
- Type definition for parameters must be declared on a **single line** above the function
- Use `export default function` or `export function` for component exports

#### Format
```tsx
type ComponentNameParams = { param1: Type1; param2: Type2; callback: () => ReturnType }

export default function ComponentName({ param1, param2, callback }: ComponentNameParams)
{
    // implementation
}
```

#### Example
```tsx
type ErrorParams = { error: Error & { digest?: string }; reset: () => void }

export default function Error({ error, reset }: ErrorParams)
{
    return <div>Error UI</div>
}
```

#### Type Definition Rules
- Type name must follow pattern: `[ComponentName]Params`
- All properties must be on a single line separated by semicolons
- Use semicolons (`;`) not commas (`,`) to separate properties in object types
- Optional properties use `?` notation: `property?: Type`
- Union types and complex types are acceptable inline: `error: Error & { digest?: string }`
  
#### General Rules
- Keep functions small and focused (max 2–3 direct parameters, use object destructuring for complex params)
- Use `useEffect` hooks with proper dependency arrays
- Maintain single quotes for simple strings, template literals for complex strings
- Use async/await for asynchronous operations with try-catch blocks



Start with the project structure, then build the core components and API routes. Make it production-ready.
