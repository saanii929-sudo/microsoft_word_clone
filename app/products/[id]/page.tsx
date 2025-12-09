"use client"
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Product {id}</h1>
      <p>This is the product page for item {id}.</p>
    </div>
  );
}