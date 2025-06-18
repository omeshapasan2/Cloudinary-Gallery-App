"use client";
import React, { useState, useEffect } from "react";
import { FileUpload } from '../components/ui/file-upload';
import { useCloudinary } from '../core/CloudinaryContext';
import { NavBar } from "../components/NavBar";

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  
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

  // Store pending files for upload
  const handleFileSelect = (files) => {
    setPendingFiles(files);
  };

  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;
    
    const activeSessionId = getActiveSessionId();
    if (!activeSessionId) {
      alert('Please select a Cloudinary account first');
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

      // Append sessionId
      formData.append('sessionId', activeSessionId);

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
          
          // Show success message
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

  const activeSessionId = getActiveSessionId();

  return (
    <div className="space-y-6">
      <NavBar/>
      {/* Account Status Section */}
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Account Status</h2>
        
        {currentAccount ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-600">
                Connected: {currentAccount.label || currentAccount.cloudName}
              </span>
            </div>
            
            {/* Session Id Display */}
            {/* {activeSessionId && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Session: {activeSessionId.substring(0, 8)}...
              </span>
            )} */}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-600">
              No account selected. Please select an account from the account selector.
            </span>
          </div>
        )}
      </div>

      {/* File Upload Section */}
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileSelect} />
      </div>
      
      {/* Upload Button */}
      <button 
        onClick={handleUpload} 
        disabled={pendingFiles.length === 0 || isUploading || !activeSessionId}
        className={`
          relative px-8 py-3 mt-4 font-semibold text-white rounded-lg
          transition-all duration-300 transform
          ${pendingFiles.length === 0 || isUploading || !activeSessionId
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
        ) : !activeSessionId ? (
          'Select Account First'
        ) : (
          `Upload Files (${pendingFiles.length})`
        )}
      </button>

      {showProgress && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-lg">
          <div className="w-48 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm mt-2 dark:text-white">{uploadProgress}% Complete</p>
        </div>
      )}

      {/* Display uploaded files */}
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