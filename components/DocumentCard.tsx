import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface DocumentCardProps {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  createdAt: string;
  authorName?: string;
}

export const DocumentCard = ({
  id,
  title,
  description,
  coverImage,
  createdAt,
  authorName,
}: DocumentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-smooth hover:shadow-large hover:-translate-y-1 gradient-card"
      onClick={() => navigate(`/editor/${id}`)}
    >
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-smooth hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
      </CardHeader>
      {description && (
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
      )}
      <CardFooter className="text-xs text-muted-foreground flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {format(new Date(createdAt), 'MMM d, yyyy')}
        </div>
        {authorName && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {authorName}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
