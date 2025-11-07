import { DocumentFormat } from '@/types/formats'
import fs from 'fs/promises'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function convertDocument(
  inputPath: string,
  outputPath: string,
  sourceFormat: DocumentFormat,
  targetFormat: DocumentFormat
): Promise<void> {
  try {
    // PDF conversions
    if (sourceFormat === 'pdf') {
      await convertFromPdf(inputPath, outputPath, targetFormat)
    } else if (targetFormat === 'pdf') {
      await convertToPdf(inputPath, outputPath, sourceFormat)
    }
    // DOCX conversions
    else if (sourceFormat === 'docx' || sourceFormat === 'doc') {
      await convertFromDocx(inputPath, outputPath, targetFormat)
    } else if (targetFormat === 'docx' || targetFormat === 'doc') {
      await convertToDocx(inputPath, outputPath, sourceFormat)
    }
    // XLSX conversions
    else if (sourceFormat === 'xlsx' || sourceFormat === 'xls') {
      await convertFromXlsx(inputPath, outputPath, targetFormat)
    } else if (targetFormat === 'xlsx' || targetFormat === 'xls') {
      await convertToXlsx(inputPath, outputPath, sourceFormat)
    }
    // ODT, RTF, EPUB - basic text extraction
    else if (sourceFormat === 'odt' || sourceFormat === 'rtf') {
      await convertFromOdt(inputPath, outputPath, targetFormat)
    } else if (targetFormat === 'odt' || targetFormat === 'rtf') {
      await convertToOdt(inputPath, outputPath, sourceFormat, targetFormat)
    }
    // EPUB, MOBI and other ebook formats
    else if (['epub', 'mobi', 'azw', 'azw3'].includes(sourceFormat)) {
      await convertFromEbook(inputPath, outputPath, targetFormat, sourceFormat)
    } else if (['epub', 'mobi', 'azw', 'azw3'].includes(targetFormat)) {
      await convertToEbook(inputPath, outputPath, sourceFormat, targetFormat)
    }
    // PPT/PPTX, ODP, ODS
    else if (['pptx', 'ppt', 'odp', 'ods'].includes(sourceFormat) || ['pptx', 'ppt', 'odp', 'ods'].includes(targetFormat)) {
      await convertPresentationOrSpreadsheet(inputPath, outputPath, sourceFormat, targetFormat)
    }
    // Simple text-based conversions
    else {
      await convertSimpleFormats(inputPath, outputPath, sourceFormat, targetFormat)
    }
  } catch (error) {
    throw new Error(`Document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Convert FROM PDF
async function convertFromPdf(inputPath: string, outputPath: string, targetFormat: DocumentFormat): Promise<void> {
  const pdfParseModule = await import('pdf-parse')
  const pdfParse = (pdfParseModule as any).default || pdfParseModule
  const dataBuffer = await fs.readFile(inputPath)
  const data = await pdfParse(dataBuffer)
  const text = data.text

  if (targetFormat === 'txt') {
    await fs.writeFile(outputPath, text, 'utf-8')
  } else if (targetFormat === 'html') {
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Converted from PDF</title></head>
<body>
<pre>${text}</pre>
</body>
</html>`
    await fs.writeFile(outputPath, html, 'utf-8')
  } else if (targetFormat === 'docx' || targetFormat === 'doc') {
    await createDocxFromText(text, outputPath)
  } else if (targetFormat === 'json') {
    await fs.writeFile(outputPath, JSON.stringify({ content: text }, null, 2), 'utf-8')
  } else if (targetFormat === 'xml') {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n<content>${escapeXml(text)}</content>\n</document>`
    await fs.writeFile(outputPath, xml, 'utf-8')
  } else {
    await fs.writeFile(outputPath, text, 'utf-8')
  }
}

// Convert TO PDF
async function convertToPdf(inputPath: string, outputPath: string, sourceFormat: DocumentFormat): Promise<void> {
  let text = ''

  if (sourceFormat === 'txt') {
    text = await fs.readFile(inputPath, 'utf-8')
  } else if (sourceFormat === 'html') {
    const html = await fs.readFile(inputPath, 'utf-8')
    text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  } else if (sourceFormat === 'json') {
    const content = await fs.readFile(inputPath, 'utf-8')
    text = JSON.stringify(JSON.parse(content), null, 2)
  } else if (sourceFormat === 'yaml') {
    text = await fs.readFile(inputPath, 'utf-8')
  } else if (sourceFormat === 'xml') {
    text = await fs.readFile(inputPath, 'utf-8')
  } else if (sourceFormat === 'csv') {
    text = await fs.readFile(inputPath, 'utf-8')
  } else {
    text = await fs.readFile(inputPath, 'utf-8')
  }

  await createPdfFromText(text, outputPath)
}

// Convert FROM DOCX/DOC - REAL SUPPORT FOR OLD DOC FORMAT!
async function convertFromDocx(inputPath: string, outputPath: string, targetFormat: DocumentFormat): Promise<void> {
  try {
    let text = ''

    // Check if it's an old DOC file (binary format) or new DOCX (XML-based)
    const buffer = await fs.readFile(inputPath)
    const isOldDoc = buffer[0] === 0xD0 && buffer[1] === 0xCF // Old DOC magic bytes

    if (isOldDoc) {
      // Use word-extractor for OLD DOC format
      const WordExtractor = require('word-extractor')
      const extractor = new WordExtractor()
      const extracted = await extractor.extract(inputPath)
      text = extracted.getBody()

      // Format output based on target
      if (targetFormat === 'html') {
        // Convert to HTML with paragraphs
        const paragraphs = text.split('\n').map(para =>
          para.trim() ? `<p>${escapeXml(para.trim())}</p>` : ''
        ).filter(p => p).join('\n')
        const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n${paragraphs}\n</body>\n</html>`
        await fs.writeFile(outputPath, html, 'utf-8')
      } else if (targetFormat === 'txt') {
        await fs.writeFile(outputPath, text, 'utf-8')
      } else if (targetFormat === 'pdf') {
        await createPdfFromText(text, outputPath)
      } else if (targetFormat === 'json') {
        await fs.writeFile(outputPath, JSON.stringify({ content: text }, null, 2), 'utf-8')
      } else if (targetFormat === 'xml') {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n<content>${escapeXml(text)}</content>\n</document>`
        await fs.writeFile(outputPath, xml, 'utf-8')
      } else if (targetFormat === 'docx') {
        await createDocxFromText(text, outputPath)
      } else if (targetFormat === 'odt') {
        // Extract text first, then create ODT
        const textPath = outputPath + '.tmp.txt'
        await fs.writeFile(textPath, text, 'utf-8')
        await convertToOdt(textPath, outputPath, 'txt', 'odt')
        await fs.unlink(textPath)
      } else if (targetFormat === 'rtf') {
        const textPath = outputPath + '.tmp.txt'
        await fs.writeFile(textPath, text, 'utf-8')
        await convertToOdt(textPath, outputPath, 'txt', 'rtf')
        await fs.unlink(textPath)
      } else {
        await fs.writeFile(outputPath, text, 'utf-8')
      }
    } else {
      // Use mammoth for DOCX (modern XML-based format)
      const mammoth = await import('mammoth')

      if (targetFormat === 'html') {
        const result = await mammoth.convertToHtml({ buffer })
        const html = result.value || '<html><body><p>No content extracted</p></body></html>'
        await fs.writeFile(outputPath, html, 'utf-8')
      } else if (targetFormat === 'txt') {
        const result = await mammoth.extractRawText({ buffer })
        await fs.writeFile(outputPath, result.value || '', 'utf-8')
      } else if (targetFormat === 'pdf') {
        const result = await mammoth.extractRawText({ buffer })
        await createPdfFromText(result.value || 'Empty document', outputPath)
      } else if (targetFormat === 'json') {
        const result = await mammoth.extractRawText({ buffer })
        await fs.writeFile(outputPath, JSON.stringify({ content: result.value || '' }, null, 2), 'utf-8')
      } else if (targetFormat === 'xml') {
        const result = await mammoth.extractRawText({ buffer })
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n<content>${escapeXml(result.value || '')}</content>\n</document>`
        await fs.writeFile(outputPath, xml, 'utf-8')
      } else if (targetFormat === 'odt') {
        const result = await mammoth.extractRawText({ buffer })
        const textPath = outputPath + '.tmp.txt'
        await fs.writeFile(textPath, result.value || '', 'utf-8')
        await convertToOdt(textPath, outputPath, 'txt', 'odt')
        await fs.unlink(textPath)
      } else if (targetFormat === 'rtf') {
        const result = await mammoth.extractRawText({ buffer })
        const textPath = outputPath + '.tmp.txt'
        await fs.writeFile(textPath, result.value || '', 'utf-8')
        await convertToOdt(textPath, outputPath, 'txt', 'rtf')
        await fs.unlink(textPath)
      } else {
        const result = await mammoth.extractRawText({ buffer })
        await fs.writeFile(outputPath, result.value || '', 'utf-8')
      }
    }
  } catch (error) {
    throw new Error(`Failed to convert DOCX/DOC: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Convert TO DOCX
async function convertToDocx(inputPath: string, outputPath: string, sourceFormat: DocumentFormat): Promise<void> {
  let text = ''

  if (sourceFormat === 'txt') {
    text = await fs.readFile(inputPath, 'utf-8')
  } else if (sourceFormat === 'html') {
    const html = await fs.readFile(inputPath, 'utf-8')
    text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')
  } else if (sourceFormat === 'json') {
    const content = await fs.readFile(inputPath, 'utf-8')
    text = JSON.stringify(JSON.parse(content), null, 2)
  } else if (sourceFormat === 'yaml' || sourceFormat === 'xml' || sourceFormat === 'csv') {
    text = await fs.readFile(inputPath, 'utf-8')
  } else {
    text = await fs.readFile(inputPath, 'utf-8')
  }

  await createDocxFromText(text, outputPath)
}

// Convert FROM XLSX
async function convertFromXlsx(inputPath: string, outputPath: string, targetFormat: DocumentFormat): Promise<void> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.readFile(inputPath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  if (targetFormat === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(sheet)
    await fs.writeFile(outputPath, csv, 'utf-8')
  } else if (targetFormat === 'json') {
    const json = XLSX.utils.sheet_to_json(sheet)
    await fs.writeFile(outputPath, JSON.stringify(json, null, 2), 'utf-8')
  } else if (targetFormat === 'html') {
    const html = XLSX.utils.sheet_to_html(sheet)
    await fs.writeFile(outputPath, html, 'utf-8')
  } else if (targetFormat === 'txt') {
    const csv = XLSX.utils.sheet_to_csv(sheet)
    await fs.writeFile(outputPath, csv, 'utf-8')
  } else if (targetFormat === 'pdf') {
    const csv = XLSX.utils.sheet_to_csv(sheet)
    await createPdfFromText(csv, outputPath)
  } else if (targetFormat === 'docx') {
    const csv = XLSX.utils.sheet_to_csv(sheet)
    await createDocxFromText(csv, outputPath)
  } else {
    const csv = XLSX.utils.sheet_to_csv(sheet)
    await fs.writeFile(outputPath, csv, 'utf-8')
  }
}

// Convert TO XLSX
async function convertToXlsx(inputPath: string, outputPath: string, sourceFormat: DocumentFormat): Promise<void> {
  const XLSX = await import('xlsx')
  let worksheet

  if (sourceFormat === 'csv') {
    const csv = await fs.readFile(inputPath, 'utf-8')
    worksheet = XLSX.utils.aoa_to_sheet(csv.split('\n').map(row => row.split(',')))
  } else if (sourceFormat === 'json') {
    const content = await fs.readFile(inputPath, 'utf-8')
    const json = JSON.parse(content)
    worksheet = XLSX.utils.json_to_sheet(Array.isArray(json) ? json : [json])
  } else if (sourceFormat === 'html') {
    const html = await fs.readFile(inputPath, 'utf-8')
    const text = html.replace(/<[^>]*>/g, '\t').replace(/\s+/g, ' ')
    worksheet = XLSX.utils.aoa_to_sheet([text.split('\t')])
  } else {
    const text = await fs.readFile(inputPath, 'utf-8')
    const lines = text.split('\n')
    worksheet = XLSX.utils.aoa_to_sheet(lines.map(line => [line]))
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, outputPath)
}

// Convert FROM ODT/RTF - PROPER XML PARSING!
async function convertFromOdt(inputPath: string, outputPath: string, targetFormat: DocumentFormat): Promise<void> {
  // ODT files are ZIP archives with XML content
  const JSZip = (await import('jszip')).default
  const buffer = await fs.readFile(inputPath)
  const zip = await JSZip.loadAsync(buffer)

  let text = ''
  if (zip.files['content.xml']) {
    const contentXml = await zip.files['content.xml'].async('string')

    // Use fast-xml-parser to properly extract text from ODT XML
    const { XMLParser } = require('fast-xml-parser')
    const parser = new XMLParser({
      ignoreAttributes: true,
      textNodeName: '#text'
    })

    try {
      const parsed = parser.parse(contentXml)
      text = extractTextFromObject(parsed)

      // Clean up excessive whitespace
      text = text.replace(/\s+/g, ' ').trim()

      // Try to preserve paragraph breaks by looking for common paragraph indicators
      // ODT paragraphs are usually separated in the XML structure
      text = text.replace(/([.!?])\s+/g, '$1\n\n')
    } catch (e) {
      // Fallback: strip tags if parsing fails
      text = contentXml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }
  } else {
    // Fallback: try to read as plain text
    text = buffer.toString('utf-8')
  }

  if (targetFormat === 'txt') {
    await fs.writeFile(outputPath, text, 'utf-8')
  } else if (targetFormat === 'html') {
    // Create HTML with proper paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim()).map(para =>
      `<p>${escapeXml(para.trim())}</p>`
    ).join('\n')
    const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n${paragraphs}\n</body>\n</html>`
    await fs.writeFile(outputPath, html, 'utf-8')
  } else if (targetFormat === 'pdf') {
    await createPdfFromText(text, outputPath)
  } else if (targetFormat === 'docx') {
    await createDocxFromText(text, outputPath)
  } else {
    await fs.writeFile(outputPath, text, 'utf-8')
  }
}

// Convert TO ODT/RTF
async function convertToOdt(inputPath: string, outputPath: string, sourceFormat: DocumentFormat, targetFormat: DocumentFormat): Promise<void> {
  const text = await fs.readFile(inputPath, 'utf-8')

  if (targetFormat === 'rtf') {
    // Create basic RTF
    const rtf = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\fswiss Helvetica;}}\n\\f0\\fs24\n${text.replace(/\n/g, '\\par\n')}\n}`
    await fs.writeFile(outputPath, rtf, 'utf-8')
  } else {
    // For ODT, create a simple ZIP with XML content
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0">
  <office:body>
    <office:text>
      <text:p>${escapeXml(text)}</text:p>
    </office:text>
  </office:body>
</office:document-content>`

    zip.file('content.xml', contentXml)
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text')

    const buffer = await zip.generateAsync({ type: 'nodebuffer' })
    await fs.writeFile(outputPath, buffer)
  }
}

// Convert FROM ebook formats - PROPER HTML/XML PARSING!
async function convertFromEbook(inputPath: string, outputPath: string, targetFormat: DocumentFormat, sourceFormat: DocumentFormat): Promise<void> {
  // For EPUB, which is a ZIP file
  if (sourceFormat === 'epub') {
    const JSZip = (await import('jszip')).default
    const buffer = await fs.readFile(inputPath)
    const zip = await JSZip.loadAsync(buffer)

    // Find HTML/XHTML files in the EPUB
    let text = ''
    let htmlContent = ''
    const { XMLParser } = require('fast-xml-parser')
    const parser = new XMLParser({
      ignoreAttributes: true,
      textNodeName: '#text'
    })

    for (const filename in zip.files) {
      if (filename.endsWith('.html') || filename.endsWith('.xhtml')) {
        try {
          const content = await zip.files[filename].async('string')

          // Try to parse HTML/XHTML to extract text properly
          try {
            const parsed = parser.parse(content)
            const extractedText = extractTextFromObject(parsed)
            text += extractedText.replace(/\s+/g, ' ').trim() + '\n\n'
            htmlContent += `<div class="chapter">${content}</div>\n`
          } catch (e) {
            // Fallback: strip tags if parsing fails
            const plainText = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
            text += plainText + '\n\n'
          }
        } catch (e) {
          console.error(`Failed to process ${filename}:`, e)
        }
      }
    }

    if (!text.trim()) {
      text = 'No readable text content found in EPUB'
    }

    if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, text, 'utf-8')
    } else if (targetFormat === 'html') {
      const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>EPUB Document</title>\n<style>body{font-family:Arial;margin:20px;line-height:1.6;}.chapter{margin-bottom:30px;padding:20px;border-bottom:2px solid #eee;}</style></head>\n<body>\n${htmlContent || `<pre>${escapeXml(text)}</pre>`}\n</body>\n</html>`
      await fs.writeFile(outputPath, html, 'utf-8')
    } else if (targetFormat === 'pdf') {
      await createPdfFromText(text, outputPath)
    } else if (targetFormat === 'docx') {
      await createDocxFromText(text, outputPath)
    } else {
      await fs.writeFile(outputPath, text, 'utf-8')
    }
  } else {
    // MOBI, AZW, AZW3 are proprietary Amazon formats
    throw new Error(`Conversion from ${sourceFormat} requires Calibre or similar tools. Please convert to EPUB first.`)
  }
}

// Convert TO ebook formats
async function convertToEbook(inputPath: string, outputPath: string, sourceFormat: DocumentFormat, targetFormat: DocumentFormat): Promise<void> {
  const text = await fs.readFile(inputPath, 'utf-8')

  if (targetFormat === 'epub') {
    // Create basic EPUB structure
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    zip.file('mimetype', 'application/epub+zip')
    zip.folder('META-INF')?.file('container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

    zip.file('content.opf', `<?xml version="1.0"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Converted Document</dc:title>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter1"/>
  </spine>
</package>`)

    zip.file('chapter1.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Document</title></head>
<body>
<pre>${escapeXml(text)}</pre>
</body>
</html>`)

    const buffer = await zip.generateAsync({ type: 'nodebuffer' })
    await fs.writeFile(outputPath, buffer)
  } else {
    throw new Error(`Conversion to ${targetFormat} requires Calibre or similar tools. Please convert to EPUB first, then use Calibre to convert to ${targetFormat}.`)
  }
}

// Convert presentations and spreadsheets - BETTER EXTRACTION
async function convertPresentationOrSpreadsheet(inputPath: string, outputPath: string, sourceFormat: DocumentFormat, targetFormat: DocumentFormat): Promise<void> {
  // Handle PPTX/ODP presentations
  if (['pptx', 'odp'].includes(sourceFormat)) {
    const JSZip = (await import('jszip')).default
    const buffer = await fs.readFile(inputPath)
    const zip = await JSZip.loadAsync(buffer)

    let text = ''
    const { XMLParser } = require('fast-xml-parser')
    const parser = new XMLParser({
      ignoreAttributes: true,
      textNodeName: '#text'
    })

    // Extract text from slides
    for (const filename in zip.files) {
      if (filename.includes('slide') && filename.endsWith('.xml')) {
        try {
          const content = await zip.files[filename].async('string')
          const parsed = parser.parse(content)
          const slideText = extractTextFromObject(parsed)
          if (slideText.trim()) {
            text += slideText.trim() + '\n\n---\n\n'
          }
        } catch (e) {
          console.error(`Failed to parse ${filename}:`, e)
        }
      }
    }

    if (!text.trim()) {
      text = 'No readable text content found in presentation'
    }

    if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, text, 'utf-8')
    } else if (targetFormat === 'pdf') {
      await createPdfFromText(text, outputPath)
    } else if (targetFormat === 'html') {
      const slides = text.split('---').filter(s => s.trim())
      let html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Presentation</title>\n<style>body{font-family:Arial;margin:20px;}.slide{border:2px solid #ccc;padding:20px;margin:20px 0;background:#f9f9f9;}</style></head>\n<body>\n<h1>Presentation</h1>\n`
      slides.forEach((slide, idx) => {
        html += `<div class="slide"><h2>Slide ${idx + 1}</h2><pre>${escapeXml(slide.trim())}</pre></div>\n`
      })
      html += `</body>\n</html>`
      await fs.writeFile(outputPath, html, 'utf-8')
    } else {
      await fs.writeFile(outputPath, text, 'utf-8')
    }
  }
  // Handle ODS spreadsheets - Use XLSX library!
  else if (sourceFormat === 'ods') {
    const XLSX = await import('xlsx')
    const workbook = XLSX.readFile(inputPath)

    if (targetFormat === 'xlsx' || targetFormat === 'xls') {
      // Direct ODS to XLSX conversion!
      XLSX.writeFile(workbook, outputPath)
    } else {
      // Convert through first sheet
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      if (targetFormat === 'csv') {
        const csv = XLSX.utils.sheet_to_csv(sheet)
        await fs.writeFile(outputPath, csv, 'utf-8')
      } else if (targetFormat === 'json') {
        const json = XLSX.utils.sheet_to_json(sheet)
        await fs.writeFile(outputPath, JSON.stringify(json, null, 2), 'utf-8')
      } else if (targetFormat === 'html') {
        const html = XLSX.utils.sheet_to_html(sheet)
        await fs.writeFile(outputPath, html, 'utf-8')
      } else if (targetFormat === 'txt') {
        const csv = XLSX.utils.sheet_to_csv(sheet)
        await fs.writeFile(outputPath, csv, 'utf-8')
      } else if (targetFormat === 'pdf') {
        const csv = XLSX.utils.sheet_to_csv(sheet)
        await createPdfFromText(csv, outputPath)
      } else {
        const csv = XLSX.utils.sheet_to_csv(sheet)
        await fs.writeFile(outputPath, csv, 'utf-8')
      }
    }
  } else {
    throw new Error(`Conversion from ${sourceFormat} to ${targetFormat} requires LibreOffice. Please use LibreOffice to export to ${targetFormat}.`)
  }
}

// Helper: Extract text recursively from parsed XML object
function extractTextFromObject(obj: any): string {
  let text = ''
  if (typeof obj === 'string') {
    return obj + ' '
  }
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (key === '#text') {
        text += obj[key] + ' '
      } else {
        text += extractTextFromObject(obj[key])
      }
    }
  }
  return text
}

// Simple text-based conversions (JSON, YAML, XML, CSV, HTML, TXT) - NOW WITH REAL PARSING!
async function convertSimpleFormats(inputPath: string, outputPath: string, sourceFormat: DocumentFormat, targetFormat: DocumentFormat): Promise<void> {
  const content = await fs.readFile(inputPath, 'utf-8')

  // JSON conversions
  if (sourceFormat === 'json') {
    const jsonData = JSON.parse(content)
    if (targetFormat === 'yaml') {
      const yamlContent = convertJsonToYaml(jsonData)
      await fs.writeFile(outputPath, yamlContent, 'utf-8')
    } else if (targetFormat === 'xml') {
      const xmlContent = convertJsonToXml(jsonData)
      await fs.writeFile(outputPath, xmlContent, 'utf-8')
    } else if (targetFormat === 'csv') {
      const csvContent = convertJsonToCsv(jsonData)
      await fs.writeFile(outputPath, csvContent, 'utf-8')
    } else if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8')
    } else if (targetFormat === 'html') {
      const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>JSON Data</title></head>\n<body>\n<pre>${JSON.stringify(jsonData, null, 2)}</pre>\n</body>\n</html>`
      await fs.writeFile(outputPath, html, 'utf-8')
    }
  }
  // YAML conversions - REAL PARSING!
  else if (sourceFormat === 'yaml') {
    const yamlData = parseYaml(content)
    if (targetFormat === 'json') {
      await fs.writeFile(outputPath, JSON.stringify(yamlData, null, 2), 'utf-8')
    } else if (targetFormat === 'xml') {
      const xmlContent = convertJsonToXml(yamlData)
      await fs.writeFile(outputPath, xmlContent, 'utf-8')
    } else if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, JSON.stringify(yamlData, null, 2), 'utf-8')
    } else if (targetFormat === 'html') {
      const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>YAML Data</title></head>\n<body>\n<pre>${JSON.stringify(yamlData, null, 2)}</pre>\n</body>\n</html>`
      await fs.writeFile(outputPath, html, 'utf-8')
    }
  }
  // XML conversions - REAL PARSING!
  else if (sourceFormat === 'xml') {
    const xmlData = parseXml(content)
    if (targetFormat === 'json') {
      await fs.writeFile(outputPath, JSON.stringify(xmlData, null, 2), 'utf-8')
    } else if (targetFormat === 'yaml') {
      const yamlContent = convertJsonToYaml(xmlData)
      await fs.writeFile(outputPath, yamlContent, 'utf-8')
    } else if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, JSON.stringify(xmlData, null, 2), 'utf-8')
    } else if (targetFormat === 'html') {
      const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>XML Data</title></head>\n<body>\n<pre>${JSON.stringify(xmlData, null, 2)}</pre>\n</body>\n</html>`
      await fs.writeFile(outputPath, html, 'utf-8')
    } else if (targetFormat === 'csv') {
      // Try to convert XML to CSV if structure is flat
      const flatData = flattenXmlForCsv(xmlData)
      const csvContent = convertJsonToCsv(flatData)
      await fs.writeFile(outputPath, csvContent, 'utf-8')
    }
  }
  // CSV conversions - REAL PARSING!
  else if (sourceFormat === 'csv') {
    const jsonData = convertCsvToJson(content)
    if (targetFormat === 'json') {
      await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8')
    } else if (targetFormat === 'yaml') {
      const yamlContent = convertJsonToYaml(jsonData)
      await fs.writeFile(outputPath, yamlContent, 'utf-8')
    } else if (targetFormat === 'xml') {
      const xmlContent = convertJsonToXml(jsonData, 'data')
      await fs.writeFile(outputPath, xmlContent, 'utf-8')
    } else if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, content, 'utf-8')
    } else if (targetFormat === 'html') {
      const html = generateHtmlTable(jsonData)
      await fs.writeFile(outputPath, html, 'utf-8')
    }
  }
  // HTML conversions
  else if (sourceFormat === 'html' && targetFormat === 'txt') {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    await fs.writeFile(outputPath, plainText, 'utf-8')
  }
  // TXT conversions
  else if (sourceFormat === 'txt' && targetFormat === 'html') {
    const htmlContent = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n<pre>${escapeXml(content)}</pre>\n</body>\n</html>`
    await fs.writeFile(outputPath, htmlContent, 'utf-8')
  } else {
    throw new Error(`Document conversion from ${sourceFormat} to ${targetFormat} is not supported`)
  }
}

// Helper: Flatten XML for CSV conversion
function flattenXmlForCsv(xmlData: any): any[] {
  // Try to find array-like structures
  for (const key in xmlData) {
    const value = xmlData[key]
    if (Array.isArray(value)) {
      return value
    } else if (typeof value === 'object') {
      const nested = flattenXmlForCsv(value)
      if (nested.length > 0) return nested
    }
  }
  // If no array found, wrap in array
  return [xmlData]
}

// Helper: Generate HTML table from JSON array
function generateHtmlTable(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Data</title></head>\n<body>\n<p>No data</p>\n</body>\n</html>`
  }

  const headers = Object.keys(data[0])
  let html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>CSV Data</title>\n<style>table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#4CAF50;color:white;}</style></head>\n<body>\n<table>\n<thead><tr>`

  headers.forEach(header => {
    html += `<th>${escapeXml(String(header))}</th>`
  })

  html += `</tr></thead>\n<tbody>`

  data.forEach(row => {
    html += `<tr>`
    headers.forEach(header => {
      html += `<td>${escapeXml(String(row[header] || ''))}</td>`
    })
    html += `</tr>\n`
  })

  html += `</tbody>\n</table>\n</body>\n</html>`
  return html
}

// Helper: Create PDF from text
async function createPdfFromText(text: string, outputPath: string): Promise<void> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Clean text: remove characters that WinAnsi encoding cannot handle
  const cleanText = sanitizeTextForPdf(text)

  const fontSize = 12
  const lineHeight = fontSize * 1.2
  const margin = 50
  const pageWidth = 595.28 // A4 width in points
  const pageHeight = 841.89 // A4 height in points
  const maxWidth = pageWidth - 2 * margin

  const lines = cleanText.split('\n')
  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let yPosition = pageHeight - margin

  for (const line of lines) {
    // Word wrap
    const words = line.split(' ')
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const width = font.widthOfTextAtSize(testLine, fontSize)

      if (width > maxWidth && currentLine) {
        // Draw current line and start new one
        try {
          page.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0)
          })
        } catch (e) {
          // If still fails, skip this line
          console.error('Failed to draw text:', e)
        }
        yPosition -= lineHeight
        currentLine = word

        // New page if needed
        if (yPosition < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight])
          yPosition = pageHeight - margin
        }
      } else {
        currentLine = testLine
      }
    }

    // Draw remaining text
    if (currentLine) {
      try {
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        })
      } catch (e) {
        // If still fails, skip this line
        console.error('Failed to draw text:', e)
      }
      yPosition -= lineHeight
    }

    // New page if needed
    if (yPosition < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight])
      yPosition = pageHeight - margin
    }
  }

  const pdfBytes = await pdfDoc.save()
  await fs.writeFile(outputPath, pdfBytes)
}

// Sanitize text for PDF (remove characters that WinAnsi cannot encode)
function sanitizeTextForPdf(text: string): string {
  // Remove control characters except newline, tab, and carriage return
  let clean = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '')

  // Replace common problematic Unicode characters with ASCII equivalents
  const replacements: { [key: string]: string } = {
    '\u2013': '-',  // en dash
    '\u2014': '--', // em dash
    '\u2018': "'",  // left single quote
    '\u2019': "'",  // right single quote
    '\u201C': '"',  // left double quote
    '\u201D': '"',  // right double quote
    '\u2026': '...', // ellipsis
    '\u00A0': ' ',  // non-breaking space
    '\u2022': '*',  // bullet
    '\u00B0': ' degrees', // degree symbol
    '\u00AB': '<<', // left guillemet
    '\u00BB': '>>', // right guillemet
  }

  for (const [unicode, ascii] of Object.entries(replacements)) {
    clean = clean.replace(new RegExp(unicode, 'g'), ascii)
  }

  // Remove any remaining characters outside WinAnsi range (keep only printable ASCII + extended Latin)
  clean = clean.replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, '')

  return clean
}

// Helper: Create DOCX from text
async function createDocxFromText(text: string, outputPath: string): Promise<void> {
  const { Document, Packer, Paragraph, TextRun } = await import('docx')

  const paragraphs = text.split('\n').map(line =>
    new Paragraph({
      children: [new TextRun(line || ' ')]
    })
  )

  const doc = new Document({
    sections: [{
      children: paragraphs
    }]
  })

  const buffer = await Packer.toBuffer(doc)
  await fs.writeFile(outputPath, buffer)
}

// Helper functions for data format conversions with REAL libraries
function convertJsonToYaml(obj: any): string {
  const yaml = require('js-yaml')
  return yaml.dump(obj, { indent: 2, lineWidth: -1 })
}

function convertJsonToXml(obj: any, rootName = 'root'): string {
  const { XMLBuilder } = require('fast-xml-parser')
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    indentBy: '  '
  })
  const wrappedObj = { [rootName]: obj }
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(wrappedObj)
}

function convertJsonToCsv(data: any): string {
  const Papa = require('papaparse')
  if (Array.isArray(data) && data.length > 0) {
    return Papa.unparse(data, { header: true })
  }
  return JSON.stringify(data)
}

function parseYaml(content: string): any {
  const yaml = require('js-yaml')
  return yaml.load(content)
}

function convertCsvToJson(content: string): any[] {
  const Papa = require('papaparse')
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  })
  return result.data
}

function parseXml(content: string): any {
  const { XMLParser } = require('fast-xml-parser')
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text'
  })
  return parser.parse(content)
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
