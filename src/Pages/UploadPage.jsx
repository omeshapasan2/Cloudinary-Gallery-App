"use client";
import React, { useState } from "react";
import { FileUpload } from '../components/ui/file-upload';

function UploadPage() {

  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // Instead of uploading immediately, just store pending files
  const handleFileSelect =(files) => {
    setPendingFiles(files);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setShowProgress(true);

    const cloudName = import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const folder = import.meta.env.VITE_PUBLIC_CLOUDINARY_FOLDER || 'default_folder';

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary configuration is missing.");
      return;
    }

    for(let i = 0; i < pendingFiles.length; i++) {
      const file = pendingFiles[i];

      // CREATE FORMDATA FIRST
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);

      // Upload Progress
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const fileProgress = Math.round((event.loaded / event.total) * 100);
          const overallProgress = Math.round(((i * 100 + fileProgress) / pendingFiles.length));
          setUploadProgress(overallProgress);
        }
      });

      // Handle response
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          console.log("File uploaded successfully:", data.secure_url);
          setFiles(prevFiles => [...prevFiles, data.secure_url]);
        } else {
          console.error("Failed to upload file:", file.name);
        }
      });

      // Send the request
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`);
      xhr.send(formData);

      // Wait for completion
      await new Promise((resolve) => {
        xhr.addEventListener('loadend', resolve);
      });

    }

    setPendingFiles([]);
    setIsUploading(false);
    setShowProgress(false);
  };

  return (
    <div>

      <div
      className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
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

    </div>
  )
}

export default UploadPage
