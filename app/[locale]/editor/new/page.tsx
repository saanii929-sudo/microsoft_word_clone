'use client';

import { DocumentCreationForm } from '@/components/DocumentCreationForm';
import { useRouter } from 'next/navigation';

export default function New() {
  const router = useRouter();

  const handleComplete = (documentId: string) => {
    router.push(`/editor/${documentId}`);
  };

  return (
    <div className="min-h-screen">
      <DocumentCreationForm onComplete={handleComplete} />
    </div>
  );
}
