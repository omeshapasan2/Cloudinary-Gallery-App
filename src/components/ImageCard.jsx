import React, { useState } from 'react';
import { Copy, MoreVertical } from 'lucide-react';

function CopyButton({ image, className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`${className} p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 ${copied ? 'bg-green-500/30' : ''}`}
      title={copied ? 'Copied!' : 'Copy URL'}
    >
      <Copy size={14} />
    </button>
  );
}

function ImageCard({ image }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 ease-out hover:translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-900">
        {/* Full Cover Image */}
        <div className="aspect-square w-full relative">
          <img 
            src={image.url} 
            alt={image.public_id} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Overlay for better button visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
        </div>

        {/* Copy Button - Top Left */}
        <CopyButton 
          image={image} 
          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />

        {/* Three Dots Button - Top Right */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100">
          <MoreVertical size={14} />
        </button>

        {/* Filename Overlay - Bottom */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transform transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <h3 className="text-white text-sm font-medium truncate" title={image.public_id}>
            {image.public_id}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
            <span>{image.format?.toUpperCase()}</span>
            <span>{image.width}×{image.height}px</span>
            <span>{Math.round(image.bytes / 1024)}KB</span>
          </div>
        </div>
      </div>
    </div>
  );
}