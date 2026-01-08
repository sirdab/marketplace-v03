import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadProps {
  userId: string;
  slug: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ userId, slug, images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const imageId = uuidv4();
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${userId}/${slug}/images/${imageId}.${fileExt}`;

      const { error } = await supabase.storage
        .from('ads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data } = supabase.storage
        .from('ads')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: t('imageUpload.invalidType'),
          description: file.name,
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: t('imageUpload.fileTooLarge'),
          description: file.name,
        });
        return false;
      }
      return true;
    });

    const remainingSlots = maxImages - images.length;
    if (validFiles.length > remainingSlots) {
      toast({
        variant: 'destructive',
        title: t('imageUpload.maxImagesReached'),
        description: t('imageUpload.maxImagesDesc', { max: maxImages }),
      });
      validFiles.splice(remainingSlots);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const newUrls: string[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const url = await uploadImage(validFiles[i]);
      if (url) {
        newUrls.push(url);
      }
      setUploadProgress(((i + 1) / validFiles.length) * 100);
    }

    if (newUrls.length > 0) {
      onImagesChange([...images, ...newUrls]);
      toast({
        title: t('imageUpload.uploadSuccess'),
        description: t('imageUpload.uploadedCount', { count: newUrls.length }),
      });
    }

    setIsUploading(false);
    setUploadProgress(0);
  }, [images, maxImages, onImagesChange, toast, t, userId, slug]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = async (indexToRemove: number) => {
    const imageUrl = images[indexToRemove];
    
    try {
      const urlParts = imageUrl.split('/ads/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('ads').remove([filePath]);
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }

    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t('imageUpload.uploading')} ({Math.round(uploadProgress)}%)
              </p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t('imageUpload.dragAndDrop')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('imageUpload.orClickToSelect')}
              </p>
            </>
          )}
        </div>
        {!isUploading && (
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            data-testid="input-image-upload"
            disabled={images.length >= maxImages}
          />
        )}
      </div>

      {images.length > 0 && (
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((url, index) => (
              <div
                key={url}
                className="relative flex-shrink-0 w-32 h-32 rounded-md overflow-hidden group border bg-card shadow-sm"
              >
                <img
                  src={url}
                  alt={`${t('imageUpload.image')} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full bg-red-600 hover:bg-red-700 text-white z-50 flex items-center justify-center border-2 border-white shadow-md pointer-events-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  data-testid={`button-remove-image-${index}`}
                >
                  <X className="h-4 w-4" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] py-0.5 text-center font-medium z-10">
                    {t('imageUpload.mainImage')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && !isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>{t('imageUpload.noImages')}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {t('imageUpload.imageCount', { current: images.length, max: maxImages })}
      </p>
    </div>
  );
}
