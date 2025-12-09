// components/CollaborationStatus.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface ActiveUser {
  id: string;
  name: string;
  color: string;
  page: number;
}

interface CollaborationStatusProps {
  activeUsers: ActiveUser[];
}

export function CollaborationStatus({ activeUsers }: CollaborationStatusProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-muted/50">
          <Users className="h-4 w-4" />
          <Badge>
            {activeUsers.length} online
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Active Collaborators</DropdownMenuLabel>
        <div className="p-2 space-y-2">
          {activeUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No other users online
            </p>
          ) : (
            activeUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    On page {user.page}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}