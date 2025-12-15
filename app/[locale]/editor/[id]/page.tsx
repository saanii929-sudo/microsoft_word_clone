'use client';

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const MsWordEditor = dynamic(
  () => import("@/components/MsWordEditor"),
  { ssr: false }
);

export default function EditDocument() {
  const params = useParams();
  const documentId = params?.id as string;

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MsWordEditor documentId={documentId} />
    </div>
  );
}

