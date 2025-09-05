"use client";

import React, { useState, DragEvent, ChangeEvent } from "react";
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';

interface DragAndDropUploadProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  placeholder?: string;
  className?: string;
}

const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({
  onFilesSelected,
  multiple = true,
  accept = "image/*",
  maxFiles = Infinity,
  placeholder = "Drag and drop files here or click to select",
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.slice(0, maxFiles);
    onFilesSelected(validFiles);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-4 text-center transition-colors cursor-pointer w-full ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <div className="flex flex-col items-center space-y-2">
        <PhotoOutlinedIcon className="text-gray-400"/>
        <p className="text-sm text-gray-600">{placeholder}</p>
      </div>
      <input
        id="fileInput"
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default DragAndDropUpload;