'use client'

import { FileFormat } from '@/types/formats'
import { FORMAT_INFO } from '@/lib/formats'

type FormatSelectorParams = { formats: FileFormat[]; selectedFormat: FileFormat | null; onSelectFormat: (format: FileFormat) => void; label: string }

export default function FormatSelector({ formats, selectedFormat, onSelectFormat, label }: FormatSelectorParams)
{
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {formats.map((format) => {
          const info = FORMAT_INFO[format]
          const isSelected = selectedFormat === format

          return (
            <button
              key={format}
              onClick={() => onSelectFormat(format)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                flex items-center justify-center
                hover:shadow-md hover:scale-105 font-medium
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                }
              `}
            >
              {info.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
