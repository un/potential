# Image Storage in 1up

This document explains how the image storage system works in the 1up application.

## Overview

The 1up app uses Cloudflare Images for secure image storage with the following features:
- Private images with signed URLs for security
- Direct uploads to Cloudflare (bypassing our backend)
- Authentication-protected image proxy
- Support for AI image analysis
- Multiple image variants/sizes

All storage functionality is contained in the `@potential/storage` package, which provides:
- Cloudflare Images API integration
- Utilities for generating signed URLs
- Helper functions for working with images

## Security Model

All images in the system have the following security properties:

1. **Private by Default**: All images are uploaded with `requireSignedURLs: true`, which means they can only be accessed via signed URLs.

2. **User Ownership**: Each image stores the owning user's ID in its metadata, ensuring that only the owner can access it.

3. **Authentication Required**: The backend proxy verifies authentication and ownership before generating signed URLs.

4. **Short-lived Access**: Signed URLs expire after a short period (typically 1 hour for regular access, 10 minutes for AI usage).

## Architecture

The image storage system has the following components:

1. **Frontend Components**:
   - `ImageUpload`: Component for uploading one or more images
   - `ImageView`: Component for viewing images with authentication

2. **Backend API**:
   - `/images/:imageId/:variant?`: Proxy endpoint that generates signed URLs and redirects
   - tRPC endpoints for creating direct uploads and getting signed URLs

3. **Cloudflare Images**:
   - Stores the actual image data
   - Manages image variants/transformations
   - Handles image delivery

## Usage

### Uploading Images

Use the `ImageUpload` component to upload one or more images:

```tsx
import { ImageUpload } from "../components/ui/image-upload";
import { View } from "react-native";

export function MyScreen() {
  const handleImagesUploaded = (images) => {
    console.log("Images uploaded:", images);
    // Save these image IDs to your user's data
    // Each image has: { imageId: string, variant: string }
  };

  return (
    <View>
      <ImageUpload 
        onImagesUploaded={handleImagesUploaded} 
        maxImages={5}
        metadata={{ type: "profile" }} // Optional custom metadata
        variant="public" // Optional variant/size
      />
    </View>
  );
}
```

### Displaying Images

Use the `ImageView` component to display images:

```tsx
import { ImageView } from "../components/ui/image-view";
import { View } from "react-native";

// Inside your component
function MyComponent() {
  return (
    <View>
      <ImageView 
        imageId="your-cloudflare-image-id" 
        variant="public" // Optional variant
        style={{ width: 300, height: 200 }} 
        resizeMode="cover" 
      />
    </View>
  );
}
```

### Accessing Images Programmatically

To get a signed URL for an image (e.g., for sharing):

```tsx
import { api } from "../utils/api";

// Inside your component with React Query
const { data } = api.storage.getSignedImageUrl.useQuery({
  imageId: "your-cloudflare-image-id",
  variant: "public"
});

// When data is available, use the URL
const imageUrl = data?.url;
```

### Accessing Images for AI

To get a URL suitable for AI analysis:

```tsx
import { api } from "../utils/api";

// Get a URL specifically for AI processing
const { data } = api.storage.getImageUrlForAI.useQuery({
  imageId: "your-cloudflare-image-id"
});

// Use this URL in your AI prompt
const aiImageUrl = data?.url;
```

## Environment Configuration

Required environment variables:

```
# Cloudflare Images Configuration
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_IMAGES_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_IMAGES_DELIVERY_URL=https://imagedelivery.net/your-account-hash
CLOUDFLARE_IMAGES_PRIVATE_KEY=your-cloudflare-private-key
```

## Variants and Transformations

Cloudflare Images supports different variants (resized/transformed versions) of each image. 
Common variants might include:

- `public`: Default full-size version
- `thumbnail`: Small preview (e.g., 100x100)
- `medium`: Medium-sized version (e.g., 500px wide)
- `profile`: Cropped version for profile pictures
- `blur`: Blurred version for placeholders

Configure these variants in your Cloudflare Images dashboard.