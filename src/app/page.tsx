// Image Background Remover
// Entry point for the application

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Background Remover',
  description: 'Remove backgrounds from images using AI',
};

export default function Home() {
  return (
    <div className="container">
      <h1>Image Background Remover</h1>
      <p>Upload an image to remove its background</p>
      {/* TODO: Add upload component */}
    </div>
  );
}