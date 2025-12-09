'use client';

import dynamic from "next/dynamic";

const MsWordEditor = dynamic(
  () => import("@/components/MsWordEditor"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f0f0]">
      <MsWordEditor />
    </main>
  );
}
