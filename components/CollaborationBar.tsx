import { Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface User {
  id: string;
  name: string;
  color: string;
}

interface CollaborationBarProps {
  activeUsers: User[];
}

export const CollaborationBar = ({ activeUsers }: CollaborationBarProps) => {
  if (activeUsers.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 bg-card rounded-lg shadow-medium border p-3 flex items-center gap-3 transition-smooth">
      <Users className="h-4 w-4 text-muted-foreground" />
      <div className="flex -space-x-2">
        {activeUsers.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger>
              <Avatar 
                className="h-8 w-8 border-2 border-background transition-smooth hover:scale-110"
                style={{ borderColor: user.color }}
              >
                <AvatarFallback style={{ backgroundColor: user.color }}>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {activeUsers.length} {activeUsers.length === 1 ? 'editor' : 'editors'}
      </span>
    </div>
  );
};
