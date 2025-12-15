'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Mic, MicOff, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface DocumentCreationFormProps {
  onComplete?: (documentId: string) => void;
}

export function DocumentCreationForm({ onComplete }: DocumentCreationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioVoiceEnabled, setAudioVoiceEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations('DocumentCreation');
  const tCommon = useTranslations('Common');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;

    try {
      // Check if storage bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

      if (bucketError) {
        console.error('Error checking storage buckets:', bucketError);
        toast.error('Storage not configured. Please set up the storage bucket in Supabase dashboard.');
        return null;
      }

      const bucketExists = buckets?.some(b => b.id === 'document-images');
      if (!bucketExists) {
        // Don't block document creation if bucket doesn't exist
        console.warn('Storage bucket "document-images" not found. Skipping image upload.');
        toast.warning('Image upload skipped (storage bucket not configured). Document will be created without image.');
        return null;
      }

      // Create a unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('document-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        // If upload fails, continue without image (don't block document creation)
        toast.warning('Failed to upload image, but continuing with document creation');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('document-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Continue without image if upload fails
      toast.warning('Image upload failed, but continuing with document creation');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to create a document');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('=== Starting Document Creation ===');
      console.log('User ID:', user?.id);
      console.log('Title:', title.trim());
      console.log('Description:', description.trim() || '(empty)');
      console.log('Audio Voice Enabled:', audioVoiceEnabled);
      console.log('Has Image:', !!imageFile);

      // Upload image if provided
      let imageUrl: string | null = null;
      if (imageFile) {
        console.log('Uploading image...');
        imageUrl = await uploadImage();
        console.log('Image URL:', imageUrl || '(upload failed or skipped)');
      }

      // Create document in database
      console.log('Creating document in database...');
      const documentData = {
        title: title.trim(),
        owner_id: user.id,
        content: {
          description: description.trim() || null,
          imageUrl: imageUrl || null,
          audioVoiceEnabled: audioVoiceEnabled,
          pageCount: 0,
          combinedContent: ''
        }
      };
      console.log('Document data:', JSON.stringify(documentData, null, 2));

      const { data: newDoc, error: docError } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (docError) {
        // Enhanced error extraction
        console.error('=== Document Creation Error ===');
        console.error('Raw error:', docError);
        console.error('Error type:', typeof docError);

        let errorMessage = 'Failed to create document';
        let errorCode: string | null = null;
        let errorDetails: string | null = null;

        // Extract error information
        if (docError && typeof docError === 'object') {
          const err = docError as any;
          errorCode = err.code || null;
          errorMessage = err.message || err.error_description || err.details || errorMessage;
          errorDetails = err.details || err.hint || null;
        }

        // Try JSON stringify
        try {
          const errorStr = JSON.stringify(docError);
          console.error('Error as JSON:', errorStr);
          if (errorStr && errorStr !== '{}') {
            const parsed = JSON.parse(errorStr);
            if (parsed.message && !errorMessage.includes('Failed')) errorMessage = parsed.message;
            if (parsed.code && !errorCode) errorCode = parsed.code;
            if (parsed.details && !errorDetails) errorDetails = parsed.details;
          }
        } catch (e) {
          console.error('Error stringifying error:', e);
        }

        // Provide helpful error messages based on error code
        if (errorCode === '42P01') {
          errorMessage = 'Database tables not found. Please run the SQL migration in your Supabase dashboard.';
        } else if (errorCode === 'PGRST301') {
          errorMessage = 'Permission denied. Please check your database Row Level Security (RLS) policies.';
        } else if (errorCode === '23505') {
          errorMessage = 'Document already exists with this ID.';
        } else if (errorCode === '23503') {
          errorMessage = 'Invalid user ID. Please sign in again.';
        } else if (errorMessage && errorMessage !== 'Failed to create document') {
          // Use the extracted error message
        } else {
          errorMessage = 'Failed to create document. Please check your connection and try again.';
        }

        if (errorDetails) {
          errorMessage += ` Details: ${errorDetails}`;
        }

        console.error('Final error message:', errorMessage);
        console.error('Error code:', errorCode);

        toast.error(errorMessage, {
          duration: 8000
        });
        return;
      }

      if (!newDoc || !newDoc.id) {
        console.error('Document created but no ID returned. Response:', newDoc);
        toast.error('Document created but no ID returned');
        return;
      }

      console.log('Document created successfully! ID:', newDoc.id);
      toast.success(tCommon('success'));

      // Call onComplete callback if provided
      if (onComplete) {
        console.log('Calling onComplete callback with document ID:', newDoc.id);
        onComplete(newDoc.id);
      } else {
        // Redirect to editor
        console.log('Redirecting to editor:', `/editor/${newDoc.id}`);
        router.push(`/editor/${newDoc.id}`);
      }
    } catch (error: any) {
      console.error('Exception creating document:', error);
      const errorMessage = error?.message || error?.toString() || 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage, {
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('title')}</h1>
          <p className="text-slate-500">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
              {t('docTitle')} <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('docTitlePlaceholder')}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of your document..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Document Image
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 mb-1">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Audio Voice Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              {audioVoiceEnabled ? (
                <Mic className="w-6 h-6 text-indigo-600" />
              ) : (
                <MicOff className="w-6 h-6 text-slate-400" />
              )}
              <div>
                <label htmlFor="audioVoice" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Enable Audio Voice
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Add voice narration to your document
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAudioVoiceEnabled(!audioVoiceEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${audioVoiceEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${audioVoiceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('creating')}
                </>
              ) : (
                <>
                  {t('create')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

