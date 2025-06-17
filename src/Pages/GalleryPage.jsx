import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CopyButton from '../components/CopyButton';
import { useCloudinary } from '../core/CloudinaryContext';

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get sessionId and currentAccount from context
  const { sessionId, currentAccount, sessions } = useCloudinary();

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://cloudinary-gallery-app-production.up.railway.app' 
    : 'http://localhost:5000';

  // Get the active session ID (either from context or from sessions based on current account)
  const getActiveSessionId = () => {
    if (sessionId) return sessionId;
    if (currentAccount && sessions[currentAccount.id]) {
      return sessions[currentAccount.id];
    }
    return null;
  };

  // Fetch images from the server using sessionId
  const fetchImages = async () => {
    const activeSessionId = getActiveSessionId();
    if (!activeSessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cloudinary`, {
        sessionId: activeSessionId
      });
      
      setImages(response.data.resources || []);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to fetch images. Please check your account connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch images when sessionId or currentAccount changes
  useEffect(() => {
    const activeSessionId = getActiveSessionId();
    if (activeSessionId) {
      fetchImages();
    }
  }, [sessionId, currentAccount]);

  const activeSessionId = getActiveSessionId();

  return (
    <div className="space-y-6">
      {/* Account Status Section */}
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Gallery - Account Status</h2>
        
        {currentAccount && activeSessionId ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-600">
                  Connected: {currentAccount.label || currentAccount.cloudName}
                </span>
              </div>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Session: {activeSessionId.substring(0, 8)}...
              </span>
            </div>
            
            <button
              onClick={fetchImages}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>Refresh Gallery</span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-600">
              No account selected. Please select an account from the account selector to view your gallery.
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl mx-auto p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="w-full max-w-4xl mx-auto p-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading images...</span>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {!isLoading && images.length > 0 && activeSessionId && (
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Cloudinary Gallery ({images.length} images)
            </h3>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {images.map((image) => (
              <div key={image.public_id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
            ))}
          </div>
        </div>
      )}

      {/* No Images State - only show if we have a session but no images */}
      {!isLoading && images.length === 0 && !error && activeSessionId && (
        <div className="w-full max-w-4xl mx-auto p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="space-y-2">
            <p className="text-lg">No images found in your Cloudinary account.</p>
            <p className="text-sm">Upload some images first to see them here!</p>
          </div>
        </div>
      )}

      {/* No Account Selected State */}
      {!activeSessionId && !isLoading && (
        <div className="w-full max-w-4xl mx-auto p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <div className="text-6xl">📷</div>
            <div className="space-y-2">
              <p className="text-xl font-medium">Ready to view your gallery?</p>
              <p className="text-sm">Select a Cloudinary account to load your images.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;