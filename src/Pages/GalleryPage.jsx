import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useCloudinary } from '../core/CloudinaryContext';
import ImageCard from '../components/ImageCard';
import FolderCard from '../components/FolderCard';
import { NavBar } from '../components/NavBar';
import { FileUpload } from '../components/ui/file-upload';
import { RefreshCw, ArrowLeft, FolderPlus, Home, Upload, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function GalleryPage() {
  const [currentFolder, setCurrentFolder] = useState(""); // "" = root
  const [folderPath, setFolderPath] = useState([]); // Breadcrumb path
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  // Upload related states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  
  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const dropRef = useRef(null);

  // Get sessionId and currentAccount from context
  const { sessionId, currentAccount, sessions } = useCloudinary();

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://cg.omeshapasan.site' 
    : 'http://localhost:5000';

  // Get the active session ID (either from context or from sessions based on current account)
  const getActiveSessionId = () => {
    if (sessionId) return sessionId;
    if (currentAccount && sessions[currentAccount.id]) {
      return sessions[currentAccount.id];
    }
    return null;
  };

  // Fetch folders from the server
  const fetchFolders = async (folder = currentFolder) => {
    const activeSessionId = getActiveSessionId();
    if (!activeSessionId) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/folders`, {
        sessionId: activeSessionId,
        folder: folder
      });
      
      setFolders(response.data.folders || []);
    } catch (err) {
      console.error("Error fetching folders:", err);
      setFolders([]);
    }
  };

  // Fetch images from the server using sessionId
  const fetchImages = async (folder = currentFolder) => {
    const activeSessionId = getActiveSessionId();
    if (!activeSessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/cloudinary`, {
        sessionId: activeSessionId,
        folder: folder
      });
      
      setImages(response.data.resources || []);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError("Failed to fetch images. Please check your account connection.");
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch both folders and images
  const fetchAll = async (folder = currentFolder) => {
    await Promise.all([
      fetchFolders(folder),
      fetchImages(folder)
    ]);
  };

  // Upload functionality
  const handleUpload = async (filesToUpload = pendingFiles) => {
    if (filesToUpload.length === 0) return;
    
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
      filesToUpload.forEach(file => {
        formData.append('files', file);
      });

      // Append sessionId
      formData.append('sessionId', activeSessionId);
      
      // Append current folder if we're in one
      if (currentFolder) {
        formData.append('folder', currentFolder);
      }

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
          
          // Clear pending files
          setPendingFiles([]);
          setUploadModalOpen(false);
          
          // Refresh the gallery
          fetchAll();
          
          // Show success message
          alert(`${response.files.length} files uploaded successfully to ${currentFolder || 'root'}!`);
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

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Check if we have an active session
      const activeSessionId = getActiveSessionId();
      if (!activeSessionId) {
        alert('Please select a Cloudinary account first');
        return;
      }
      
      // Upload directly without showing modal
      handleUpload(files);
    }
  };

  // Set up drag and drop event listeners
  useEffect(() => {
    const div = dropRef.current;
    if (div) {
      div.addEventListener('dragenter', handleDragEnter);
      div.addEventListener('dragleave', handleDragLeave);
      div.addEventListener('dragover', handleDragOver);
      div.addEventListener('drop', handleDrop);

      return () => {
        div.removeEventListener('dragenter', handleDragEnter);
        div.removeEventListener('dragleave', handleDragLeave);
        div.removeEventListener('dragover', handleDragOver);
        div.removeEventListener('drop', handleDrop);
      };
    }
  }, [dragCounter]);

  // Navigate to a folder
  const navigateToFolder = (folderName) => {
    const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
    setCurrentFolder(newPath);
    setFolderPath([...folderPath, folderName]);
  };

  // Navigate back to parent folder
  const navigateBack = () => {
    if (folderPath.length === 0) return;
    
    const newPath = [...folderPath];
    newPath.pop();
    const newCurrentFolder = newPath.join('/');
    
    setCurrentFolder(newCurrentFolder);
    setFolderPath(newPath);
  };

  // Navigate to root
  const navigateToRoot = () => {
    setCurrentFolder("");
    setFolderPath([]);
  };

  // Navigate to specific breadcrumb
  const navigateToBreadcrumb = (index) => {
    const newPath = folderPath.slice(0, index + 1);
    const newCurrentFolder = newPath.join('/');
    
    setCurrentFolder(newCurrentFolder);
    setFolderPath(newPath);
  };

  // Create new folder
  const handleCreateFolder = async () => {
    const activeSessionId = getActiveSessionId();
    if (!activeSessionId || !newFolderName.trim()) return;

    try {
      const folderPath = currentFolder ? `${currentFolder}/${newFolderName.trim()}` : newFolderName.trim();
      
      await axios.post(`${API_BASE_URL}/api/create-folder`, {
        sessionId: activeSessionId,
        folderPath: folderPath
      });
      
      setNewFolderName("");
      setCreateFolderOpen(false);
      fetchAll(); // Refresh folders and images
    } catch (err) {
      console.error("Create folder failed", err);
      alert("Failed to create folder. Please try again.");
    }
  };

  // Handle file selection from modal
  const handleFileSelect = (files) => {
    setPendingFiles(files);
  };

  // Fetch data when sessionId, currentAccount, or currentFolder changes
  useEffect(() => {
    const activeSessionId = getActiveSessionId();
    if (activeSessionId) {
      fetchAll();
    }
  }, [sessionId, currentAccount, currentFolder]);

  const activeSessionId = getActiveSessionId();

  return (
    <div className="space-y-6" ref={dropRef}>
      <NavBar/>
      
      {/* Drag Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm border-4 border-dashed border-blue-500 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop files to upload</h3>
            <p className="text-gray-600">
              Files will be uploaded to {currentFolder || 'root folder'}
            </p>
          </div>
        </div>
      )}
      
      {/* Account Status Section */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center justify-between">
            {currentAccount && activeSessionId ? (
              <>
                {/* Left side - Status */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                      Connected to {currentAccount.label || currentAccount.cloudName}
                    </span>
                    <span className="text-sm font-medium text-gray-900 sm:hidden">
                      Connected
                    </span>
                  </div>
                </div>
                
                {/* Right side - Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCreateFolderOpen(true)}
                    className="group relative p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    title="Create Folder"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => fetchAll()}
                    disabled={isLoading}
                    className="group relative p-2 text-gray-700 hover:text-black hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    title="Refresh Gallery"
                  >
                    <RefreshCw 
                      className={`w-4 h-4 transition-transform duration-500 ${
                        isLoading ? 'animate-spin' : 'group-hover:rotate-180'
                      }`} 
                    />
                    {isLoading && (
                      <div className="absolute inset-0 rounded-full border border-gray-300 animate-pulse"></div>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 w-full">
                <div className="relative">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-sm text-gray-700">
                  <span className="hidden sm:inline">No account selected. Please select an account to view your gallery.</span>
                  <span className="sm:hidden">No account selected</span>
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Subtle bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Enhanced Breadcrumb Navigation */}
      {activeSessionId && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm">
              {/* Home/Root Button */}
              <button
                onClick={navigateToRoot}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors duration-200 ${
                  folderPath.length === 0 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Root</span>
              </button>
              
              {/* Breadcrumb Trail */}
              {folderPath.map((folder, index) => (
                <React.Fragment key={index}>
                  <span className="text-gray-400 dark:text-gray-600">/</span>
                  <button
                    onClick={() => navigateToBreadcrumb(index)}
                    className={`px-2 py-1 rounded transition-colors duration-200 ${
                      index === folderPath.length - 1
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {folder}
                  </button>
                </React.Fragment>
              ))}
            </div>
            
            {/* Back Button */}
            {folderPath.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={navigateBack}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to {folderPath.length > 1 ? folderPath[folderPath.length - 2] : 'Root'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
            <span className="text-gray-600 dark:text-gray-400">Loading content...</span>
          </div>
        </div>
      )}

      {/* Content Grid - Folders and Images */}
      {!isLoading && activeSessionId && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(folders.length > 0 || images.length > 0) && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentFolder ? `${currentFolder}` : `Your Cloudinary Gallery`}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {folders.length} folder{folders.length !== 1 ? 's' : ''}, {images.length} image{images.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
          
          {/* Grid Layout */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {/* Folders First */}
            {folders.map((folder) => (
              <FolderCard 
                key={folder.name} 
                folder={folder} 
                onNavigate={navigateToFolder}
                onActionComplete={() => fetchAll()}
                currentFolderPath={currentFolder}
              />
            ))}
            
            {/* Then Images */}
            {images.map((image) => (
              <ImageCard 
                key={image.public_id} 
                image={image} 
                onActionComplete={() => fetchAll()}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Content State */}
      {!isLoading && folders.length === 0 && images.length === 0 && !error && activeSessionId && (
        <div className="w-full max-w-4xl mx-auto p-8 text-center text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <div className="text-6xl">📁</div>
            <div className="space-y-2">
              <p className="text-xl font-medium">
                {currentFolder ? `"${currentFolder}" is empty` : 'Your gallery is empty'}
              </p>
              <p className="text-sm">Upload some images or create folders to get started!</p>
              <p className="text-xs text-gray-400">Drag and drop files anywhere or use the upload button</p>
            </div>
            {currentFolder && (
              <button
                onClick={navigateBack}
                className="mt-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go back</span>
              </button>
            )}
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
              <p className="text-sm">Select a Cloudinary account to load your content.</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Upload Button */}
      {activeSessionId && (
        <button
          onClick={() => setUploadModalOpen(true)}
          disabled={isUploading}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-40"
          title="Upload Files"
        >
          <Upload className={`w-6 h-6 ${isUploading ? 'animate-pulse' : ''}`} />
        </button>
      )}

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </DialogTitle>
            <DialogDescription>
              Upload files to {currentFolder ? `"${currentFolder}"` : 'root folder'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Upload Component */}
            <div className="min-h-64 border border-dashed bg-white border-neutral-200 rounded-lg">
              <FileUpload onChange={handleFileSelect} />
            </div>
            
            {/* Upload Actions */}
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-600">
                {pendingFiles.length > 0 && (
                  <span>{pendingFiles.length} file{pendingFiles.length !== 1 ? 's' : ''} selected</span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setUploadModalOpen(false);
                    setPendingFiles([]);
                  }}
                  className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpload()}
                  disabled={pendingFiles.length === 0 || isUploading}
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload {pendingFiles.length > 0 ? `(${pendingFiles.length})` : ''}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              {currentFolder ? (
                <>Create a new folder inside <span className="font-medium">"{currentFolder}"</span></>
              ) : (
                'Create a new folder in the root directory'
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newFolderName.trim()) {
                  handleCreateFolder();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => {
                setCreateFolderOpen(false);
                setNewFolderName("");
              }}
              className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors duration-200"
            >
              Create
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Notification */}
      {showProgress && (
        <div className="fixed bottom-6 left-6 bg-white border border-gray-200 rounded-xl p-4 shadow-2xl z-50 animate-slide-up">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">
              Uploading to {currentFolder || 'root'}...
            </span>
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
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default GalleryPage;