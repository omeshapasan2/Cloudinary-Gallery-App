import React, { useState, useRef } from 'react';
import { Folder, MoreVertical, FolderOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { useCloudinary } from '../core/CloudinaryContext';

function FolderCard({ folder, onNavigate, onActionComplete, currentFolderPath }) {
  const [isHovered, setIsHovered] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { sessionId, currentAccount, sessions } = useCloudinary();

  const API_BASE_URL = process.env.NODE_ENV === "production"
    ? "http://185.194.142.40:5000"
    : "http://localhost:5000";

  const getActiveSessionId = () => {
    if (sessionId) return sessionId;
    if (currentAccount && sessions[currentAccount.id]) {
      return sessions[currentAccount.id];
    }
    return null;
  };

  const handleRename = async () => {
    const sid = getActiveSessionId();
    if (!sid || !newFolderName) return;

    try {
      const currentFolderFullPath = currentFolderPath 
        ? `${currentFolderPath}/${folder.name}` 
        : folder.name;
      
      const newFolderFullPath = currentFolderPath 
        ? `${currentFolderPath}/${newFolderName}` 
        : newFolderName;

      await axios.post(`${API_BASE_URL}/api/rename-folder`, {
        sessionId: sid,
        currentFolderPath: currentFolderFullPath,
        newFolderPath: newFolderFullPath,
      });
      
      onActionComplete(); // Refresh folders
    } catch (err) {
      console.error("Rename folder failed", err);
      alert("Failed to rename folder. Please try again.");
    } finally {
      setRenameOpen(false);
      setNewFolderName("");
    }
  };

  const handleDelete = async () => {
    const sid = getActiveSessionId();
    if (!sid) return;

    try {
      const folderFullPath = currentFolderPath 
        ? `${currentFolderPath}/${folder.name}` 
        : folder.name;

      await axios.post(`${API_BASE_URL}/api/delete-folder`, {
        sessionId: sid,
        folderPath: folderFullPath,
      });
      
      onActionComplete(); // Refresh folders
    } catch (err) {
      console.error("Delete folder failed", err);
      alert("Failed to delete folder. Make sure the folder is empty and try again.");
    } finally {
      setDeleteOpen(false);
    }
  };

  const handleFolderClick = (e) => {
    // Check if the click target is part of the dropdown menu
    const dropdownButton = e.currentTarget.querySelector('[data-dropdown-trigger]');
    const dropdownContent = document.querySelector('[data-radix-popper-content-wrapper]');
    
    // If clicking on dropdown button or its content, don't navigate
    if (dropdownButton && (dropdownButton.contains(e.target) || e.target === dropdownButton)) {
      return;
    }
    
    if (dropdownContent && dropdownContent.contains(e.target)) {
      return;
    }
    
    onNavigate(folder.name);
  };

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 ease-out hover:translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleFolderClick}
    >
      {/* Main Card */}
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
        
        {/* Folder Content */}
        <div className="aspect-square w-full relative flex flex-col items-center justify-center p-6">
          {/* Folder Icon */}
          <div className="relative mb-3">
            {isHovered ? (
              <FolderOpen className="w-16 h-16 text-blue-600 dark:text-blue-400 transition-all duration-300" />
            ) : (
              <Folder className="w-16 h-16 text-blue-500 dark:text-blue-300 transition-all duration-300" />
            )}
            
            {/* Badge for folder count if available */}
            {folder.path && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                {folder.path.split('/').length}
              </div>
            )}
          </div>
          
          {/* Folder Name */}
          <h3 className="text-center text-sm font-medium text-gray-900 dark:text-white truncate w-full px-2" title={folder.name}>
            {folder.name}
          </h3>
          
          {/* Folder Info */}
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center space-y-1">
            <div>Folder</div>
            {folder.path && (
              <div className="truncate w-full px-2" title={folder.path}>
                Path: {folder.path}
              </div>
            )}
          </div>
        </div>

        {/* Three Dots Button - Top Right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              data-dropdown-trigger
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MoreVertical size={14} />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="z-50">
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                setNewFolderName(folder.name);
                setRenameOpen(true);
              }}
            >
              Rename Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                setDeleteOpen(true);
              }}
              className="text-red-600 focus:text-red-600"
            >
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hover Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for the folder "{folder.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter new folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newFolderName && newFolderName !== folder.name) {
                  handleRename();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => {
                setRenameOpen(false);
                setNewFolderName("");
              }}
              className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              disabled={!newFolderName || newFolderName === folder.name}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors duration-200"
            >
              Rename
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the folder "{folder.name}"? This action cannot be undone and will delete all contents within the folder.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FolderCard;