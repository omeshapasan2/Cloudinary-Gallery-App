import React from 'react'
import CopyButton from './CopyButton';

function ImageCard({ image }) {
  return (
    <div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={image.url} 
                  alt={image.public_id} 
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={image.public_id}>
                    {image.public_id}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Format: {image.format?.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {image.width}×{image.height}px
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(image.bytes / 1024)}KB
                    </p>
                  </div>
                </div>
                <CopyButton image={image} />
        </div>
    </div>
  )
}

export default ImageCard