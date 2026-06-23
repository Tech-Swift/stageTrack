// src/components/FormFileUpload.tsx
import React, { useState, useRef } from 'react';

interface FormFileUploadProps {
  label: string;
  name: string;
  onUploadSuccess: (url: string) => void;
  error?: string;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const FormFileUpload: React.FC<FormFileUploadProps> = ({
  label,
  name,
  onUploadSuccess,
  error,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setLocalError("File is too large. Maximum size allowed is 10MB.");
      return;
    }

    setIsUploading(true);
    setLocalError(null);
    setUploadedFileName(null);

    const uploaderData = new FormData();
    uploaderData.append('file', file);
    uploaderData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const targetEndpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

      const response = await fetch(targetEndpoint, {
        method: 'POST',
        body: uploaderData,
      });

      if (!response.ok) {
        throw new Error("Cloudinary asset intake endpoint rejected payload structure.");
      }

      const fileAsset = await response.json();
      
      // Save file name locally to show the user it was attached successfully
      setUploadedFileName(file.name);
      onUploadSuccess(fileAsset.secure_url);
    } catch (err: any) {
      console.error('Direct Cloudinary asset pipe failed:', err);
      setLocalError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const fileInputId = `file-${name}`;

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={fileInputId} className="font-bold mb-1 text-gray-700 text-sm">
        {label}
      </label>
      
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={fileInputId}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          accept="image/*,application/pdf"
        />
        
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className={`px-4 py-2 text-sm font-semibold rounded border transition-all ${
            isUploading 
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : uploadedFileName
                ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-100'
          }`}
        >
          {isUploading ? 'Uploading...' : uploadedFileName ? 'Change File' : 'Choose File'}
        </button>

        {/* Visual feedback indicating a successful upload */}
        {uploadedFileName && !isUploading && (
          <div className="flex items-center gap-1 text-sm text-green-600 font-medium animate-fadeIn">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="truncate max-w-[180px] sm:max-w-[240px]">{uploadedFileName}</span>
          </div>
        )}
      </div>

      {(error || localError) && (
        <span className="text-red-500 text-sm mt-1 font-medium">
          {error || localError}
        </span>
      )}
    </div>
  );
};

export default FormFileUpload;