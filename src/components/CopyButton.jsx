import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ image }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button 
      className="
        group relative overflow-hidden
        bg-blue-500 hover:bg-blue-600 active:bg-blue-700
        px-4 py-2 sm:px-6 sm:py-3
        mx-4 mb-4 font-semibold text-white rounded-lg
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-blue-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 sm:gap-3
        text-sm sm:text-base
        min-w-[120px] justify-center
        w-full sm:w-auto
      "
      onClick={handleCopy}
      disabled={copied}
    >
      {/* Background shine effect */}
      <div className="
        absolute inset-0 
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        -translate-x-full group-hover:translate-x-full
        transition-transform duration-700 ease-in-out
      " />
      
      {/* Icon with animation */}
      <div className="
        transition-all duration-300 ease-in-out
        transform group-hover:rotate-12
      ">
        {copied ? (
          <Check className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
        ) : (
          <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </div>
      
      {/* Text with typing effect when copied */}
      <span className="
        relative z-10 
        transition-all duration-300 ease-in-out
        group-hover:tracking-wide
      ">
        {copied ? (
          <span className="animate-pulse">Copied!</span>
        ) : (
          'Copy URL'
        )}
      </span>
      
      {/* Ripple effect overlay */}
      <div className="
        absolute inset-0 rounded-lg
        bg-white/20 opacity-0 group-active:opacity-100
        transition-opacity duration-150
        animate-ping group-active:animate-none
      " />
    </button>
  );
}