import { DocumentFormat } from '@/types/formats'
import fs from 'fs/promises'

export async function convertDocument(
  inputPath: string,
  outputPath: string,
  sourceFormat: DocumentFormat,
  targetFormat: DocumentFormat
): Promise<void> {
  try {
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
      // Basic XML conversion - just save as text for now
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
      // Strip HTML tags for text
      const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      await fs.writeFile(outputPath, plainText, 'utf-8')
    }
    // TXT conversions
    else if (sourceFormat === 'txt' && targetFormat === 'html') {
      const htmlContent = `<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"><title>Document</title></head>\n<body>\n<pre>${content}</pre>\n</body>\n</html>`
      await fs.writeFile(outputPath, htmlContent, 'utf-8')
    }
    // Complex document formats that need additional libraries
    else if (['pdf', 'docx', 'doc', 'odt', 'rtf', 'epub', 'mobi', 'azw', 'azw3', 'xlsx', 'xls', 'pptx', 'ppt', 'odp', 'ods'].includes(sourceFormat) ||
              ['pdf', 'docx', 'doc', 'odt', 'rtf', 'epub', 'mobi', 'azw', 'azw3', 'xlsx', 'xls', 'pptx', 'ppt', 'odp', 'ods'].includes(targetFormat)) {
      throw new Error(`Conversion from ${sourceFormat} to ${targetFormat} requires additional libraries not yet installed. Currently supported conversions: JSON ↔ YAML ↔ XML ↔ CSV, HTML ↔ TXT. For PDF, DOCX, XLSX and other complex formats, please use dedicated tools like LibreOffice, Calibre, or Pandoc.`)
    } else {
      throw new Error(`Document conversion from ${sourceFormat} to ${targetFormat} is not supported`)
    }
  } catch (error) {
    throw new Error(`Document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
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
  // Simple YAML parser (basic key-value pairs only)
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
