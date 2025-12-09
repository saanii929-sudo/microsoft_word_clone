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
    if (open && documentId) {
      loadCollaborators();
    }
  }, [open, documentId]);

  const loadCollaborators = async () => {
    try {
      const { data, error } = await supabase
        .from('document_collaborators')
        .select(`
          id,
          user_id,
          permission_level,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('document_id', documentId);

      if (error) throw error;
      setCollaborators(data || []);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  };

  const inviteCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      // First, find user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .single();

      if (userError) throw userError;

      const { error } = await supabase
        .from('document_collaborators')
        .insert({
          document_id: documentId,
          user_id: userData.id,
          permission_level: permission,
          invited_by: user?.id,
        });

      if (error) throw error;

      toast.success('Collaborator invited');
      setEmail('');
      loadCollaborators();
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      if (error.code === '23505') {
        toast.error('User is already a collaborator');
      } else {
        toast.error('Failed to invite collaborator');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('document_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      toast.success('Collaborator removed');
      loadCollaborators();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error('Failed to remove collaborator');
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
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Can view</SelectItem>
                  <SelectItem value="comment">Can comment</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
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