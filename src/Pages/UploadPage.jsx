"use client";
import React, { useState } from "react";
import { FileUpload } from '../components/ui/file-upload';

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  
  // NEW: Add these states for credentials and session
  const [sessionId, setSessionId] = useState(null);
  const [credentials, setCredentials] = useState({
    cloudName: '',
    apiKey: '',
    apiSecret: ''
  });
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cloudinary-gallery-app-production.up.railway.app' 
  : 'http://localhost:5000';

  // NEW: Handle credential input changes
  const handleCredentialChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // NEW: Create session with credentials
  const createSession = async () => {
    if (!credentials.cloudName || !credentials.apiKey || !credentials.apiSecret) {
      alert('Please fill in all credential fields');
      return;
    }

    setIsCreatingSession(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      if (response.ok) {
        setSessionId(data.sessionId);
        alert('Credentials configured successfully!');
      } else {
        alert('Failed to configure credentials: ' + data.error);
      }
    } catch (error) {
      console.error('Session creation error:', error);
      alert('Error configuring credentials. Please try again.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  // Store pending files for upload
  const handleFileSelect = (files) => {
    setPendingFiles(files);
  };

  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;
    
    // NEW: Check for sessionId instead of credentials
    if (!sessionId) {
      alert('Please configure credentials first');
      return;
    }

    setIsUploading(true);
    setShowProgress(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Append all files to FormData
      pendingFiles.forEach(file => {
        formData.append('files', file);
      });

      // CHANGED: Append sessionId instead of credentials
      formData.append('sessionId', sessionId);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle successful response
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log('Upload successful:', response);
          
          // Add uploaded files to the files state
          const uploadedUrls = response.files.map(file => file.url);
          setFiles(prevFiles => [...prevFiles, ...uploadedUrls]);
          
          // Clear pending files
          setPendingFiles([]);
          
          // Show success message (optional)
          alert(`${response.files.length} files uploaded successfully!`);
        } else {
          console.error('Upload failed:', xhr.responseText);
          alert('Upload failed. Please try again.');
        }
        
        setIsUploading(false);
        setShowProgress(false);
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        console.error('Upload error');
        alert('Upload error. Please try again.');
        setIsUploading(false);
        setShowProgress(false);
      });

      // Send the request to your backend
      xhr.open('POST', `${API_BASE_URL}/api/upload`);
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error. Please try again.');
      setIsUploading(false);
      setShowProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* NEW: Credentials Form */}
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Configure Cloudinary Credentials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cloud Name</label>
            <input
              type="text"
              value={credentials.cloudName}
              onChange={(e) => handleCredentialChange('cloudName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter cloud name"
              disabled={!!sessionId}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="text"
              value={credentials.apiKey}
              onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter API key"
              disabled={!!sessionId}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">API Secret</label>
            <input
              type="password"
              value={credentials.apiSecret}
              onChange={(e) => handleCredentialChange('apiSecret', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter API secret"
              disabled={!!sessionId}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={createSession}
            disabled={isCreatingSession || !!sessionId}
            className={`
              px-6 py-2 font-medium rounded-lg transition-all
              ${sessionId 
                ? 'bg-green-500 text-white cursor-default' 
                : isCreatingSession
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            {sessionId ? 'Credentials Configured ✓' : isCreatingSession ? 'Configuring...' : 'Configure Credentials'}
          </button>
          
          {sessionId && (
            <span className="text-sm text-green-600 font-medium">
              Session ID: {sessionId.substring(0, 8)}...
            </span>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileSelect} />
      </div>
      
      {/* UPDATED: Upload button validation */}
      <button 
        onClick={handleUpload} 
        disabled={pendingFiles.length === 0 || isUploading || !sessionId}
        className={`
          relative px-8 py-3 mt-4 font-semibold text-white rounded-lg
          transition-all duration-300 transform
          ${pendingFiles.length === 0 || isUploading || !sessionId
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95 hover:shadow-xl'
          }
          ${isUploading ? 'animate-pulse' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading...</span>
          </div>
        ) : !sessionId ? (
          'Configure Credentials First'
        ) : (
          `Upload Files (${pendingFiles.length})`
        )}
      </button>

      {showProgress && (
        <div className="fixed bottom-4 right-4 bg-white border rounded-lg p-4 shadow-lg">
          <div className="w-48 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm mt-2">{uploadProgress}% Complete</p>
        </div>
      )}

      {/* Display uploaded files (optional) */}
      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Uploaded Files:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((url, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img 
                  src={url} 
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;