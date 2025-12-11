import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Copy, Mail, Trash2 } from 'lucide-react';

interface Collaborator {
  id: string;
  user_id: string;
  permission_level: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
}

export function ShareDialog({ open, onOpenChange, documentId, documentTitle }: ShareDialogProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('edit');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && documentId && documentId !== 'new') {
      loadCollaborators();
    } else if (open && documentId === 'new') {
      // New document, no collaborators yet
      setCollaborators([]);
    }
  }, [open, documentId]);

  const loadCollaborators = async () => {
    if (!supabase) {
      console.warn('Supabase is not configured. Collaboration features are disabled.');
      return;
    }

    if (!documentId || documentId === 'new') {
      setCollaborators([]);
      return;
    }

    try {
      const { data: collaboratorsData, error: collaboratorsError } = await supabase
        .from('document_collaborators')
        .select('id, user_id, permission_level')
        .eq('document_id', documentId);

      if (collaboratorsError) throw collaboratorsError;

      // Fetch profile data for each collaborator
      const collaboratorsWithProfiles = await Promise.all(
        (collaboratorsData || []).map(async (collab) => {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', collab.user_id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.warn(`Error loading profile for user ${collab.user_id}:`, profileError);
            }

            return {
              id: collab.id,
              user_id: collab.user_id,
              permission_level: collab.permission_level,
              profiles: {
                full_name: profile?.full_name || 'Unknown User',
                email: profile?.email || ''
              }
            };
          } catch (err: any) {
            console.warn(`Error processing collaborator ${collab.user_id}:`, err);
            return {
              id: collab.id,
              user_id: collab.user_id,
              permission_level: collab.permission_level,
              profiles: {
                full_name: 'Unknown User',
                email: ''
              }
            };
          }
        })
      );

      setCollaborators(collaboratorsWithProfiles);
    } catch (error: any) {
      console.error('Error loading collaborators:', error);
      // Show user-friendly error message
      if (error?.message) {
        console.error('Error details:', error.message);
      }
      // Don't show toast for empty results, just log
      if (error?.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        toast.error('Failed to load collaborators');
      }
    }
  };

  const inviteCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!supabase) {
      toast.error('Supabase is not configured. Please configure your environment variables.');
      return;
    }

    if (!documentId || documentId === 'new') {
      toast.error('Please save the document first before inviting collaborators');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to invite collaborators');
      return;
    }

    setLoading(true);
    try {
      // First, find user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          throw new Error('User not found. Please make sure they have signed up.');
        }
        throw userError;
      }

      if (!userData || !userData.id) {
        throw new Error('User not found');
      }

      // Check if user is trying to invite themselves
      if (userData.id === user.id) {
        toast.error('You cannot invite yourself as a collaborator');
        setLoading(false);
        return;
      }

      // Insert collaborator
      const { error: insertError } = await supabase
        .from('document_collaborators')
        .insert({
          document_id: documentId,
          user_id: userData.id,
          permission_level: permission,
          invited_by: user.id,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('User is already a collaborator on this document');
        }
        if (insertError.code === '23503') {
          throw new Error('Document not found or you do not have permission');
        }
        throw insertError;
      }

      toast.success(`Collaborator invited: ${userData.full_name || userData.email}`);
      setEmail('');
      loadCollaborators();
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      const errorMessage = error?.message || error?.error_description || 'Failed to invite collaborator';
      
      if (error?.code === '23505') {
        toast.error('User is already a collaborator');
      } else if (error?.code === 'PGRST116') {
        toast.error('User not found. Please make sure they have signed up.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    if (!supabase) {
      toast.error('Supabase is not configured. Please configure your environment variables.');
      return;
    }

    if (!documentId || documentId === 'new') {
      toast.error('Invalid document');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to remove collaborators');
      return;
    }

    try {
      const { error } = await supabase
        .from('document_collaborators')
        .delete()
        .eq('id', collaboratorId)
        .eq('document_id', documentId); // Extra safety check

      if (error) {
        if (error.code === 'PGRST301') {
          throw new Error('You do not have permission to remove this collaborator');
        }
        throw error;
      }

      toast.success('Collaborator removed');
      loadCollaborators();
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      const errorMessage = error?.message || error?.error_description || 'Failed to remove collaborator';
      
      if (error?.code === 'PGRST301') {
        toast.error('You do not have permission to remove this collaborator');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const copyShareLink = async () => {
    const shareLink = `${window.location.origin}/document/${documentId}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{documentTitle}"</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on this document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!supabase && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Supabase is not configured. Collaboration features are disabled. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.
              </p>
            </div>
          )}

          {/* Share Link */}
          <div className="space-y-2">
            <Label>Shareable Link</Label>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/document/${documentId}`}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyShareLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Invite by Email */}
          <form onSubmit={inviteCollaborator} className="space-y-3">
            <Label>Invite by Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-36 h-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 font-semibold shadow-md hover:shadow-lg transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl">
                  <SelectItem value="view" className="cursor-pointer">Can view</SelectItem>
                  <SelectItem value="comment" className="cursor-pointer">Can comment</SelectItem>
                  <SelectItem value="edit" className="cursor-pointer">Can edit</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={loading}>
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Collaborators List */}
          <div className="space-y-2">
            <Label>Collaborators</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">
                      {collaborator.profiles.full_name || collaborator.profiles.email}
                    </p>
                    <Badge className="text-xs">
                      {collaborator.permission_level}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => removeCollaborator(collaborator.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}