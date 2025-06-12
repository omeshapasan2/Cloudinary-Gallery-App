"use client";
import React, { useState } from "react";
import { FileUpload } from '../components/ui/file-upload';

function UploadPage() {

  const [files, setFiles] = useState([]);
  const handleFileUpload = (files) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div>

      <div
      className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>

    </div>
  )
}

export default UploadPage
