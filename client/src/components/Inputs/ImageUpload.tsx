"use client";

import React, { useState, DragEvent, ChangeEvent } from "react";
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';

interface ImageUploadProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesSelected,
  multiple = true,
  maxFiles = 5,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const validFiles = imageFiles.slice(0, maxFiles);
    setSelectedFiles(validFiles);
    onFilesSelected(validFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const validFiles = imageFiles.slice(0, maxFiles);
      setSelectedFiles(validFiles);
      onFilesSelected(validFiles);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-4 text-center transition-colors cursor-pointer w-full ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("imageInput")?.click()}
    >
      <div className="flex flex-col items-center space-y-2">
        <PhotoOutlinedIcon className="text-gray-400 text-4xl"/>
        <p className="text-sm text-gray-600">
          {selectedFiles.length > 0 
            ? `${selectedFiles.length} image(s) selected` 
            : "Drag & drop images here or click to select"
          }
        </p>
        {selectedFiles.length > 0 && (
          <div className="text-xs text-green-600">
            {selectedFiles.map((file, index) => (
              <div key={index}>✓ {file.name}</div>
            ))}
          </div>
        )}
      </div>
      <input
        id="imageInput"
        type="file"
        multiple={multiple}
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ImageUpload;
