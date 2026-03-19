// src/app/api/remove/route.ts
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return Response.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    if (!imageFile.type.startsWith('image/')) {
      return Response.json({ success: false, error: 'File is not an image' }, { status: 400 });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return Response.json({ success: false, error: 'Image size exceeds 5MB limit' }, { status: 400 });
    }

    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return Response.json({ success: false, error: 'API key not configured' }, { status: 500 });
    }

    const apiFormData = new FormData();
    apiFormData.append('image_file_b64', base64Image);
    apiFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: apiFormData,
    });

    if (!response.ok) {
      return Response.json({ success: false, error: `API error: ${response.status}` }, { status: 500 });
    }

    const resultBuffer = await response.arrayBuffer();
    const base64Result = Buffer.from(resultBuffer).toString('base64');
    
    return Response.json({ success: true, imageUrl: `data:image/png;base64,${base64Result}` });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message || 'Failed to process image' }, { status: 500 });
  }
}