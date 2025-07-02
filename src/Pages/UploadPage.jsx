"use client";
import React, { useState, useEffect } from "react";
import { FileUpload } from '../components/ui/file-upload';
import { useCloudinary } from '../core/CloudinaryContext';
import { NavBar } from "../components/NavBar";
import { Upload, Check } from "lucide-react";

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  
  // Get sessionId and currentAccount from context
  const { sessionId, currentAccount, sessions } = useCloudinary();

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'http://185.194.142.40:5000' 
    : 'http://localhost:5000';

  // Get the active session ID (either from context or from sessions based on current account)
  const getActiveSessionId = () => {
    if (sessionId) return sessionId;
    if (currentAccount && sessions[currentAccount.id]) {
      return sessions[currentAccount.id];
    }
    return null;
  };

  const activeSessionId = getActiveSessionId();

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

  const getButtonContent = () => {
    if (isUploading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Uploading...</span>
        </div>
      );
    }
    
    if (!activeSessionId) {
      return 'Select Account First';
    }
    
    return (
      <div className="flex items-center space-x-2">
        <Upload className="w-4 h-4" />
        <span>Upload Files ({pendingFiles.length})</span>
      </div>
    );
  };

  const isDisabled = pendingFiles.length === 0 || isUploading || !activeSessionId;

  return (
    <div className="min-h-screen">
      <NavBar/>
      
      <div className="space-y-6 pb-8">
        {/* Account Status Section */}
        <div className="w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 flex items-center">
              {currentAccount ? (
                <div className="flex items-center space-x-3 animate-fade-in">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 transition-colors duration-200">
                    <span className="hidden sm:inline">Connected to {currentAccount.label || currentAccount.cloudName}</span>
                    <span className="sm:hidden">Connected</span>
                  </span>
                  
                  {/* Optional Session ID - uncomment if needed */}
                  {/* {activeSessionId && (
                    <span className="hidden md:inline text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-mono">
                      {activeSessionId.substring(0, 8)}...
                    </span>
                  )} */}
                </div>
              ) : (
                <div className="flex items-center space-x-3 animate-fade-in">
                  <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm text-gray-700">
                    <span className="hidden sm:inline">No account selected. Please select an account from the account selector.</span>
                    <span className="sm:hidden">No account selected</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Subtle bottom accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* File Upload Section */}
          <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white border-neutral-200 rounded-lg">
            <FileUpload onChange={handleFileSelect} />
          </div>
          
          {/* Upload Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleUpload} 
              disabled={isDisabled}
              className={`
                relative px-6 py-3 font-medium rounded-lg border-2 transition-all duration-300 transform
                ${isDisabled
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                  : 'bg-black border-black text-white hover:bg-gray-800 hover:border-gray-800 hover:scale-105 active:scale-95 hover:shadow-lg'
                }
                ${isUploading ? 'animate-pulse' : ''}
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              `}
            >
              {getButtonContent()}
            </button>
          </div>

          {/* Uploaded Files Gallery */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Uploaded Files ({files.length})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.map((url, index) => (
                  <div key={index} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Image number badge */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Notification */}
      {showProgress && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-xl p-4 shadow-2xl z-50 animate-slide-up">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Uploading files...</span>
          </div>
          
          <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-600">{uploadProgress}% Complete</span>
            {uploadProgress === 100 && (
              <Check className="w-4 h-4 text-green-600" />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default UploadPage;