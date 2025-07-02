import React, { useState } from 'react';
import { Copy, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios';
import { useCloudinary } from '../core/CloudinaryContext';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


function CopyButton({ image, className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
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
      className={`${className} p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 ${copied ? 'bg-green-500/30' : ''}`}
      title={copied ? 'Copied!' : 'Copy URL'}
    >
      <Copy size={14} />
    </button>
  );
}

function ImageCard({ image, onActionComplete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newName, setNewName] = useState("");
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
    if (!sid || !newName) return;

    try {
      await axios.post(`${API_BASE_URL}/api/rename`, {
        sessionId: sid,
        currentPublicId: image.public_id,
        newPublicId: newName,
      });
      onActionComplete(); // Refresh images
    } catch (err) {
      console.error("Rename failed", err);
    } finally {
      setRenameOpen(false);
    }
  };

  const handleDelete = async () => {
    const sid = getActiveSessionId();
    if (!sid) return;

    try {
      await axios.post(`${API_BASE_URL}/api/delete`, {
        sessionId: sid,
        publicId: image.public_id,
      });
      onActionComplete(); // Refresh images
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 ease-out hover:translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-900">
        {/* Full Cover Image */}
        <div className="aspect-square w-full relative">
          <img 
            src={image.url} 
            alt={image.public_id} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Overlay for better button visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
        </div>

        {/* Copy Button - Top Left */}
        <CopyButton 
          image={image} 
          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />

        {/* Three Dots Button - Top Right */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100">
                <MoreVertical size={14} />
                </button>
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent align="end" className="">
                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                    </DialogTrigger>
                    <DialogTitle></DialogTitle>
                    <DialogContent>
                        <DialogHeader>
                            Rename Image
                        </DialogHeader>
                        <DialogDescription>
                            Enter a new name for the image
                        </DialogDescription>

                        <div className="grid gap-4">
                            <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                            </div>
                            <div className="grid gap-3">
                            <Label htmlFor="username-1">Username</Label>
                            <Input id="username-1" name="username" defaultValue="@peduarte" />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>


                <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                Rename
                </DropdownMenuItem> */}

                {/* <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Rename Image</DialogTitle>
                    <DialogDescription>Enter a new name for the image</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 mt-4">
                    <Label htmlFor="new-name">New Name</Label>
                    <Input
                        id="new-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={() => setRenameOpen(false)}
                        className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRename}
                        className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        Submit
                    </button>
                    </div>
                </DialogContent>
                </Dialog> */}

                {/* <DropdownMenuSeparator />
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent> */}

            <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => {
                    setNewName(image.public_id);
                    setRenameOpen(true)
                  }}
                >
                    Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>

            {/* Rename Dialog Box */}
            <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Rename Image</DialogTitle>
                    <DialogDescription>Enter a new name for the image</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 mt-4">
                    <Label htmlFor="new-name">New Name</Label>
                    <Input
                        id="new-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={() => setRenameOpen(false)}
                        className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRename}
                        className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        Submit
                    </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Delete Image</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this image?</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={() => setDeleteOpen(false)}
                        className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-500 text-white"
                    >
                        Delete
                    </button>
                    </div>
                </DialogContent>
            </Dialog>


        </DropdownMenu>

        {/* Filename Overlay - Bottom */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transform transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <h3 className="text-white text-sm font-medium truncate" title={image.public_id}>
            {image.public_id}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
            <span>{image.format?.toUpperCase()}</span>
            <span>{image.width}×{image.height}px</span>
            <span>{Math.round(image.bytes / 1024)}KB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
