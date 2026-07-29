import { useState, useRef } from 'react';
import { Icons } from '@/components/shared/icons';
import { toast } from 'sonner';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';

interface ImageDropzoneProps {
  value: string;
  onChange: (url: string, metadata?: any) => void;
  label?: string;
  aspect?: 'square' | 'video' | 'banner';
  className?: string;
}

export default function ImageDropzone({
  value,
  onChange,
  label,
  aspect = 'square',
  className = '',
}: ImageDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary settings with safe local defaults
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'kwickly-demo';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'kwickly_unsigned_preset';

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    setIsUploading(true);
    const toastId = toast.loading('Uploading image to Cloudinary...');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const secureUrl = response.data.secure_url;
      const publicId = response.data.public_id;
      const format = response.data.format;
      const bytes = response.data.bytes;

      toast.success('Image uploaded successfully', { id: toastId });
      onChange(secureUrl, {
        provider: 'cloudinary',
        publicId,
        format,
        bytes,
      });
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      const message = error.response?.data?.error?.message || 'Failed to upload image to Cloudinary.';
      toast.error(message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    switch (aspect) {
      case 'banner':
        return 'aspect-[3/1] w-full';
      case 'video':
        return 'aspect-video w-full';
      case 'square':
      default:
        return 'aspect-square w-32 h-32';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-semibold text-foreground/80">{label}</label>}
      
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
          isDragActive 
            ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5 scale-[0.99]' 
            : 'border-border  hover:border-primary/50 hover:bg-muted/30'
        } ${getAspectClass()}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        {value ? (
          <div className="relative w-full h-full group">
            <img src={value} alt="Uploaded asset" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-all shadow-sm transform hover:"
                title="Remove image"
              >
                <Icons.Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : isUploading ? (
          <div className="text-center space-y-2 p-4">
            <Icons.Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" />
            <span className="text-xs text-muted-foreground font-medium block">Uploading...</span>
          </div>
        ) : (
          <div className="text-center space-y-2.5 p-4">
            <div className="p-2 bg-primary/5 text-primary rounded-lg w-fit mx-auto shadow-sm">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="text-xs font-semibold text-foreground">
              Drag & drop or click
            </div>
            <div className="text-[10px] text-muted-foreground font-medium">
              PNG, JPG or WebP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
