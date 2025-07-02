import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Copy } from 'lucide-react';

function MiniCopyButton({ image, className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
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
      className={`${className} p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors duration-200 ${copied ? 'bg-green-600/60' : ''}`}
      title={copied ? 'Copied!' : 'Copy URL'}
    >
      <Copy size={16} />
    </button>
  );
}

function ImageModal({ open, onOpenChange, images, index, setIndex }) {
  const [loaded, setLoaded] = useState(false);
  const image = images[index] || null;

  useEffect(() => {
    setLoaded(false);
  }, [index]);

  if (!image) return null;

  const prev = () => {
    setIndex((index - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((index + 1) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 bg-transparent shadow-none border-none max-w-3xl">
        <div className="relative bg-black flex items-center justify-center">
          <img
            src={image.url}
            alt={image.public_id}
            className={`max-h-[80vh] w-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ArrowRight size={20} />
              </button>
            </>
          )}
          <MiniCopyButton image={image} className="absolute bottom-2 right-2" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImageModal;
