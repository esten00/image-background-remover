# Image Background Remover

A simple web application for removing backgrounds from images using AI.

## Features
- Upload images to remove background
- Download processed images with transparent background
- Simple and intuitive UI
- Drag & drop support
- Real-time preview of original vs processed image

## Tech Stack
- Frontend: Next.js 14 + App Router
- Styling: Tailwind CSS
- Language: TypeScript
- Image Processing: remove.bg API

## Setup

### Prerequisites
- Node.js 18+
- A remove.bg API key (get it from https://www.remove.bg/api)

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` file with your API key:
   ```
   REMOVEBG_API_KEY=your_remove_bg_api_key_here
   ```
4. Run locally: `npm run dev`
5. Visit `http://localhost:3000`

## Deployment

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/esten00/image-background-remover&env=REMOVEBG_API_KEY&envDescription=Your%20remove.bg%20API%20key&envLink=https://www.remove.bg/api)

### Deploy to Cloudflare Pages
1. Fork this repository
2. In Cloudflare Pages dashboard, connect your GitHub account
3. Select this repository
4. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
5. Add environment variable: `REMOVEBG_API_KEY`

## API Usage
The application uses remove.bg API to process images. The API endpoint is located at `/api/remove`.

## Contributing
Feel free to submit issues and enhancement requests!