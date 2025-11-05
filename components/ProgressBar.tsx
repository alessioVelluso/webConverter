'use client'

type ProgressBarParams = { progress: number; status: string }

export default function ProgressBar({ progress, status }: ProgressBarParams)
{
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {status}
        </span>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
