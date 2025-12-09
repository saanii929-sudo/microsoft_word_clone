'use client';

import dynamic from "next/dynamic";

const MultiPageEditor = dynamic(
  () => import("@/components/Editor"),
  { ssr: false }
);

export default function New() {
  return (
    <div className="p-4">
      <MultiPageEditor />
    </div>
  );
}
