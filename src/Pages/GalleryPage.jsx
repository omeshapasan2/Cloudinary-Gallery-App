import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import CopyButton from '../components/CopyButton';

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Credentials form state
  const [cloudName, setCloudName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://cloudinary-gallery-app-production.up.railway.app' 
    : 'http://localhost:5000';

  // Create session with credentials
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cloudName,
          apiKey,
          apiSecret
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      
      // Store sessionId
      setSessionId(result.sessionId);
      
      alert("Credentials configured successfully!");

    } catch (error) {
      console.error("Error submitting details:", error);
      setError("Failed to configure credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch images from the server using sessionId
  const fetchImages = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cloudinary`, {
        sessionId: sessionId
      });
      
      setImages(response.data.resources || []);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to fetch images. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch images when sessionId is available
  useEffect(() => {
    if (sessionId) {
      fetchImages();
    }
  }, [sessionId]);

  return (
    <div className="space-y-6">
      {/* Credentials Section */}
      {!sessionId ? (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Configure Cloudinary Credentials</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cloud Name
              </label>
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. my-cloud"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:text-white"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="e.g. 1234567890"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:text-white"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Secret
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="•••••••••••"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:text-white"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !cloudName || !apiKey || !apiSecret}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Configuring..." : "Configure & Load Gallery"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Session Status */}
          <div className="w-full max-w-4xl mx-auto p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-green-800 dark:text-green-200 font-medium">
                  Connected to Cloudinary - Session: {sessionId.substring(0, 8)}...
                </span>
              </div>
              <button
                onClick={fetchImages}
                disabled={isLoading}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-4xl mx-auto p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="w-full max-w-4xl mx-auto p-8 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading images...</span>
              </div>
            </div>
          )}

          {/* Images Grid */}
          {!isLoading && images.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {images.map((image) => (
                <div key={image.public_id} className="border rounded-lg overflow-hidden shadow-md">
                  <img src={image.url} alt={image.public_id} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{image.public_id}</h3>
                    <p className="text-sm text-gray-500">Format: {image.format}</p>
                    <p className="text-sm text-gray-500">Dimensions: {image.width}x{image.height}</p>
                  </div>
                  <CopyButton image={image} />
                </div>
              ))}
            </div>
          )}

          {/* No Images State */}
          {!isLoading && images.length === 0 && !error && (
            <div className="w-full max-w-4xl mx-auto p-8 text-center text-gray-500">
              <p>No images found in your Cloudinary account.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GalleryPage;