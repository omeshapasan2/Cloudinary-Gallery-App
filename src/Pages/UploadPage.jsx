"use client";
import React, { useState } from "react";
import { FileUpload } from '../components/ui/file-upload';

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // Store pending files for upload
  const handleFileSelect = (files) => {
    setPendingFiles(files);
  };

  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    setShowProgress(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Append all files to FormData
      pendingFiles.forEach(file => {
        formData.append('files', file);
      });

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
      xhr.open('POST', 'http://localhost:5000/api/upload');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error. Please try again.');
      setIsUploading(false);
      setShowProgress(false);
    }
  };

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileSelect} />
      </div>
      
      <button 
        onClick={handleUpload} 
        disabled={pendingFiles.length === 0 || isUploading}
        className={`
          relative px-8 py-3 mt-4 font-semibold text-white rounded-lg
          transition-all duration-300 transform
          ${pendingFiles.length === 0 || isUploading 
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