// functions/api/remove.ts
export async function onRequestPost(context: any) {
  try {
    const formData = await context.request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return new Response(JSON.stringify({ success: false, error: 'No image file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!imageFile.type.startsWith('image/')) {
      return new Response(JSON.stringify({ success: false, error: 'File is not an image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ success: false, error: 'Image size exceeds 5MB limit' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const buffer = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(buffer)));

    const apiKey = context.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
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
      return new Response(JSON.stringify({ success: false, error: `API error: ${response.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resultBuffer = await response.arrayBuffer();
    const base64Result = btoa(String.fromCharCode(...new Uint8Array(resultBuffer)));
    
    return new Response(JSON.stringify({ success: true, imageUrl: `data:image/png;base64,${base64Result}` }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message || 'Failed to process image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}