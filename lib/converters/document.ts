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

// Convert FROM DOCX
async function convertFromDocx(inputPath: string, outputPath: string, targetFormat: DocumentFormat): Promise<void> {
  const mammoth = await import('mammoth')
  const buffer = await fs.readFile(inputPath)

  if (targetFormat === 'html') {
    const result = await mammoth.convertToHtml({ buffer })
    await fs.writeFile(outputPath, result.value, 'utf-8')
  } else if (targetFormat === 'txt') {
    const result = await mammoth.extractRawText({ buffer })
    await fs.writeFile(outputPath, result.value, 'utf-8')
  } else if (targetFormat === 'pdf') {
    const result = await mammoth.extractRawText({ buffer })
    await createPdfFromText(result.value, outputPath)
  } else if (targetFormat === 'json') {
    const result = await mammoth.extractRawText({ buffer })
    await fs.writeFile(outputPath, JSON.stringify({ content: result.value }, null, 2), 'utf-8')
  } else if (targetFormat === 'xml') {
    const result = await mammoth.extractRawText({ buffer })
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n<content>${escapeXml(result.value)}</content>\n</document>`
    await fs.writeFile(outputPath, xml, 'utf-8')
  } else {
    const result = await mammoth.extractRawText({ buffer })
    await fs.writeFile(outputPath, result.value, 'utf-8')
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

// Convert FROM ODT/RTF
async function convertFromOdt(inputPath: string, outputPath: string, targetFormat: DocumentFormat): Promise<void> {
  // ODT files are ZIP archives with XML content
  const JSZip = (await import('jszip')).default
  const buffer = await fs.readFile(inputPath)
  const zip = await JSZip.loadAsync(buffer)

  let text = ''
  if (zip.files['content.xml']) {
    const contentXml = await zip.files['content.xml'].async('string')
    text = contentXml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  } else {
    // Fallback: try to read as plain text
    text = buffer.toString('utf-8')
  }

  if (targetFormat === 'txt') {
    await fs.writeFile(outputPath, text, 'utf-8')
  } else if (targetFormat === 'html') {
    const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n<p>${text}</p>\n</body>\n</html>`
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

// Convert FROM ebook formats
async function convertFromEbook(inputPath: string, outputPath: string, targetFormat: DocumentFormat, sourceFormat: DocumentFormat): Promise<void> {
  // For EPUB, which is a ZIP file
  if (sourceFormat === 'epub') {
    const JSZip = (await import('jszip')).default
    const buffer = await fs.readFile(inputPath)
    const zip = await JSZip.loadAsync(buffer)

    // Find HTML/XHTML files in the EPUB
    let text = ''
    for (const filename in zip.files) {
      if (filename.endsWith('.html') || filename.endsWith('.xhtml')) {
        const content = await zip.files[filename].async('string')
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        text += plainText + '\n\n'
      }
    }

    if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, text, 'utf-8')
    } else if (targetFormat === 'html') {
      const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n<pre>${text}</pre>\n</body>\n</html>`
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

// Convert presentations and other spreadsheets
async function convertPresentationOrSpreadsheet(inputPath: string, outputPath: string, sourceFormat: DocumentFormat, targetFormat: DocumentFormat): Promise<void> {
  // These are complex formats - try to extract text
  if (['pptx', 'odp'].includes(sourceFormat)) {
    const JSZip = (await import('jszip')).default
    const buffer = await fs.readFile(inputPath)
    const zip = await JSZip.loadAsync(buffer)

    let text = ''
    for (const filename in zip.files) {
      if (filename.endsWith('.xml')) {
        const content = await zip.files[filename].async('string')
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        text += plainText + '\n'
      }
    }

    if (targetFormat === 'txt') {
      await fs.writeFile(outputPath, text, 'utf-8')
    } else if (targetFormat === 'pdf') {
      await createPdfFromText(text, outputPath)
    } else if (targetFormat === 'html') {
      const html = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Presentation</title></head>\n<body>\n<pre>${text}</pre>\n</body>\n</html>`
      await fs.writeFile(outputPath, html, 'utf-8')
    } else {
      await fs.writeFile(outputPath, text, 'utf-8')
    }
  } else {
    throw new Error(`Conversion from ${sourceFormat} to ${targetFormat} requires LibreOffice. Please use LibreOffice to export to ${targetFormat}.`)
  }
}

// Simple text-based conversions (JSON, YAML, XML, CSV, HTML, TXT)
async function convertSimpleFormats(inputPath: string, outputPath: string, sourceFormat: DocumentFormat, targetFormat: DocumentFormat): Promise<void> {
  const content = await fs.readFile(inputPath, 'utf-8')

  // JSON conversions
  if (sourceFormat === 'json' && targetFormat === 'yaml') {
    const jsonData = JSON.parse(content)
    const yamlContent = convertJsonToYaml(jsonData)
    await fs.writeFile(outputPath, yamlContent, 'utf-8')
  } else if (sourceFormat === 'json' && targetFormat === 'xml') {
    const jsonData = JSON.parse(content)
    const xmlContent = convertJsonToXml(jsonData)
    await fs.writeFile(outputPath, xmlContent, 'utf-8')
  } else if (sourceFormat === 'json' && targetFormat === 'csv') {
    const jsonData = JSON.parse(content)
    const csvContent = convertJsonToCsv(jsonData)
    await fs.writeFile(outputPath, csvContent, 'utf-8')
  } else if (sourceFormat === 'json' && targetFormat === 'txt') {
    await fs.writeFile(outputPath, JSON.stringify(JSON.parse(content), null, 2), 'utf-8')
  }
  // YAML conversions
  else if (sourceFormat === 'yaml' && targetFormat === 'json') {
    const yamlData = parseYaml(content)
    await fs.writeFile(outputPath, JSON.stringify(yamlData, null, 2), 'utf-8')
  } else if (sourceFormat === 'yaml' && targetFormat === 'xml') {
    const yamlData = parseYaml(content)
    const xmlContent = convertJsonToXml(yamlData)
    await fs.writeFile(outputPath, xmlContent, 'utf-8')
  } else if (sourceFormat === 'yaml' && targetFormat === 'txt') {
    await fs.writeFile(outputPath, content, 'utf-8')
  }
  // XML conversions
  else if (sourceFormat === 'xml' && (targetFormat === 'json' || targetFormat === 'yaml' || targetFormat === 'txt')) {
    await fs.writeFile(outputPath, content, 'utf-8')
  }
  // CSV conversions
  else if (sourceFormat === 'csv' && targetFormat === 'json') {
    const jsonData = convertCsvToJson(content)
    await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8')
  } else if (sourceFormat === 'csv' && targetFormat === 'txt') {
    await fs.writeFile(outputPath, content, 'utf-8')
  }
  // HTML conversions
  else if (sourceFormat === 'html' && targetFormat === 'txt') {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    await fs.writeFile(outputPath, plainText, 'utf-8')
  }
  // TXT conversions
  else if (sourceFormat === 'txt' && targetFormat === 'html') {
    const htmlContent = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n<pre>${content}</pre>\n</body>\n</html>`
    await fs.writeFile(outputPath, htmlContent, 'utf-8')
  } else {
    throw new Error(`Document conversion from ${sourceFormat} to ${targetFormat} is not supported`)
  }
}

// Helper: Create PDF from text
async function createPdfFromText(text: string, outputPath: string): Promise<void> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const fontSize = 12
  const lineHeight = fontSize * 1.2
  const margin = 50
  const pageWidth = 595.28 // A4 width in points
  const pageHeight = 841.89 // A4 height in points
  const maxWidth = pageWidth - 2 * margin
  const maxHeight = pageHeight - 2 * margin

  const lines = text.split('\n')
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
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        })
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
      page.drawText(currentLine, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0)
      })
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

// Helper functions for data format conversions
function convertJsonToYaml(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent)
  let yaml = ''

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      yaml += `${spaces}${key}:\n${convertJsonToYaml(value, indent + 1)}`
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`
      value.forEach(item => {
        yaml += `${spaces}  - ${JSON.stringify(item)}\n`
      })
    } else {
      yaml += `${spaces}${key}: ${value}\n`
    }
  }
  return yaml
}

function convertJsonToXml(obj: any, rootName = 'root'): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`

  function buildXml(data: any, indent = 1): string {
    const spaces = '  '.repeat(indent)
    let result = ''

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result += `${spaces}<${key}>\n${buildXml(value, indent + 1)}${spaces}</${key}>\n`
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          result += `${spaces}<${key}>${item}</${key}>\n`
        })
      } else {
        result += `${spaces}<${key}>${value}</${key}>\n`
      }
    }
    return result
  }

  xml += buildXml(obj)
  xml += `</${rootName}>`
  return xml
}

function convertJsonToCsv(data: any): string {
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0])
    let csv = headers.join(',') + '\n'
    data.forEach(row => {
      csv += headers.map(h => JSON.stringify(row[h] || '')).join(',') + '\n'
    })
    return csv
  }
  return JSON.stringify(data)
}

function parseYaml(content: string): any {
  const lines = content.split('\n')
  const result: any = {}

  lines.forEach(line => {
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/)
    if (match) {
      const key = match[2].trim()
      const value = match[3].trim()
      result[key] = value
    }
  })

  return result
}

function convertCsvToJson(content: string): any[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim())
  const result: any[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const obj: any = {}
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    result.push(obj)
  }

  return result
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
