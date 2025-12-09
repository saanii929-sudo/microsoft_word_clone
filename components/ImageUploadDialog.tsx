// components/ImageUploadDialog.tsx
import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Link, 
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Wand2,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onImageInsert: (url: string) => void;
  userId?: string;
  children?: React.ReactNode;
}

export function ImageUploadDialog({ 
  open, 
  onOpenChange, 
  onImageInsert, 
  userId,
  children
}: ImageUploadDialogProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId || 'anonymous'}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      onImageInsert(publicUrl);
      toast.success('Image uploaded successfully');
      setDialogOpen?.(false);
      
      // Reset states
      setUploadProgress(0);
      setImageUrl('');
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUrlInsert = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
      onImageInsert(imageUrl);
      toast.success('Image inserted from URL');
      setDialogOpen?.(false);
      setImageUrl('');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      let response: Response;
      try {
        response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: aiPrompt.trim(),
            size: '1024x1024',
          }),
        });
      } catch (fetchError: any) {
        console.error('Network error:', fetchError);
        throw new Error(`Network Error: ${fetchError.message || 'Failed to connect to server'}. Make sure your development server is running.`);
      }

      // Parse JSON response
      let data: any = {};
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (parseError: any) {
          console.error('JSON parse error:', parseError);
          data = { error: 'Invalid response from server', message: 'Server returned invalid JSON' };
        }
      } else {
        const text = await response.text().catch(() => '');
        data = { error: 'Invalid response format', message: text || 'Server returned non-JSON response' };
      }

      if (!response.ok) {
        const errorMessage = data.details || data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        const hint = data.hint || '';
        console.error('Image generation error:', {
          status: response.status,
          statusText: response.statusText,
          error: data,
          contentType
        });
        
        if (response.status === 500 && (data.error?.includes('not configured') || data.message?.includes('not configured'))) {
          throw new Error(`API Key Error: ${errorMessage}${hint ? '. ' + hint : ''}. Please check your .env.local file and restart the server.`);
        } else if (response.status === 401) {
          throw new Error(`Invalid API Key: ${errorMessage}. Please verify your key at platform.openai.com`);
        } else if (response.status === 402) {
          throw new Error(`Payment Required: ${errorMessage}. Please add credits to your OpenAI account.`);
        } else if (response.status === 429) {
          throw new Error(`Rate Limit: ${errorMessage}. Please wait a moment and try again.`);
        } else {
          throw new Error(`Generation Failed: ${errorMessage}${hint ? '. ' + hint : ''}`);
        }
      }

      if (data.url) {
        onImageInsert(data.url);
        toast.success('AI image generated and inserted!');
        setDialogOpen?.(false);
        setAiPrompt('');
      } else {
        throw new Error('No image URL returned from API');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`, {
        duration: 6000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image from your computer or insert from a URL
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="ai">AI Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              } ${uploading ? 'opacity-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={uploading}
              />
              
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              
              <div className="space-y-2">
                <p className="font-medium">Drag and drop an image</p>
                <p className="text-sm text-muted-foreground">
                  or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline"
                    disabled={uploading}
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>

              {uploading && (
                <div className="mt-4 space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Supported Formats</div>
                  <div className="text-sm font-medium">PNG, JPG, GIF, WebP</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Max Size</div>
                  <div className="text-sm font-medium">5 MB</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="image-url">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlInsert()}
                />
                <Button onClick={handleUrlInsert}>
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Insert</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Placeholder', url: 'https://via.placeholder.com/400x300' },
                  { name: 'Landscape', url: 'https://picsum.photos/400/300' },
                  { name: 'Portrait', url: 'https://picsum.photos/300/400' },
                  { name: 'Square', url: 'https://picsum.photos/300/300' },
                ].map((image, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageUrl(image.url);
                      toast.success('URL copied to field');
                    }}
                    className="h-16 text-xs"
                  >
                    {image.name}
                  </Button>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">Need an image?</div>
                    <div className="text-muted-foreground">
                      Try these free resources
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('https://unsplash.com, https://picsum.photos')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="ai-prompt">Describe the image you want to generate</Label>
              <Textarea
                id="ai-prompt"
                placeholder="A beautiful sunset over mountains, digital art style..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[100px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAiGenerate();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter (or Cmd+Enter on Mac) to generate
              </p>
            </div>

            <Button 
              onClick={handleAiGenerate}
              disabled={!aiPrompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium mb-1">Powered by AI</div>
                  <div className="text-xs">
                    Requires OpenAI API key. Set OPENAI_API_KEY in your environment variables.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}