"use client";

import React, { useState, DragEvent, ChangeEvent } from "react";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface AudioUploadProps {
  onFileSelected: (file: File | null) => void;
  className?: string;
}

const AudioUpload: React.FC<AudioUploadProps> = ({
  onFileSelected,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    if (audioFile) {
      setSelectedFile(audioFile);
      onFileSelected(audioFile);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelected(file);
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
      onClick={() => document.getElementById("audioInput")?.click()}
    >
      <div className="flex flex-col items-center space-y-2">
        <VolumeUpIcon className="text-gray-400 text-4xl"/>
        <p className="text-sm text-gray-600">
          {selectedFile ? selectedFile.name : "Drag & drop audio file here or click to select"}
        </p>
        {selectedFile && (
          <p className="text-xs text-green-600">✓ Audio file selected</p>
        )}
      </div>
      <input
        id="audioInput"
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default AudioUpload;
