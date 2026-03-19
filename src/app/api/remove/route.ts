// src/app/api/remove/route.ts
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return Response.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return Response.json({ success: false, error: 'File is not an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return Response.json({ success: false, error: 'Image size exceeds 5MB limit' }, { status: 400 });
    }

    // Convert File to ArrayBuffer then to base64
    const buffer = await imageFile.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    // Create form data for remove.bg API
    const apiFormData = new FormData();
    apiFormData.append('image_file_b64', base64Image);
    apiFormData.append('size', 'auto');

    // Call remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVEBG_API_KEY || '',
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ 
        success: false, 
        error: `API request failed: ${response.status} ${errorText}` 
      }, { status: 500 });
    }

    // Get the processed image as ArrayBuffer
    const resultBuffer = await response.arrayBuffer();
    
    // Convert to base64 for client-side display
    const base64Result = btoa(
      new Uint8Array(resultBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    return Response.json({ 
      success: true, 
      imageUrl: `data:image/png;base64,${base64Result}` 
    });
  } catch (error: any) {
    console.error('Error processing image:', error);
    return Response.json({ 
      success: false, 
      error: error.message || 'Failed to process image' 
    }, { status: 500 });
  }
}