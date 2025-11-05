'use client'

import { FileCategory } from '@/types/formats'
import { CATEGORY_INFO } from '@/lib/formats'

type CategorySelectorParams = { selectedCategory: FileCategory | null; onSelectCategory: (category: FileCategory) => void }

export default function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorParams)
{
  const categories: FileCategory[] = ['image', 'audio', 'video', 'document', 'archive']

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Select File Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const info = CATEGORY_INFO[category]
          const isSelected = selectedCategory === category

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200
                flex flex-col items-center justify-center gap-3
                hover:shadow-lg hover:scale-105
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                }
              `}
            >
              <span className="text-4xl">{info.icon}</span>
              <span className="font-semibold text-lg">{info.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
