export async function uploadImage(file: File): Promise<string> {
  try {
    // Get upload URL from server
    const uploadResponse = await fetch('/api/images/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadURL } = await uploadResponse.json();

    // Upload file to cloud storage
    const uploadFileResponse = await fetch(uploadURL, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadFileResponse.ok) {
      throw new Error('Failed to upload image');
    }

    // Extract the image path from the upload URL
    const url = new URL(uploadURL);
    const pathParts = url.pathname.split('/');
    const imagePath = `/images/${pathParts[pathParts.length - 1]}`;
    
    return imagePath;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function getImageFromClipboard(clipboardData: DataTransfer): File | null {
  const items = clipboardData.items;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith('image/')) {
      return item.getAsFile();
    }
  }
  
  return null;
}

export function getImagesFromDrop(dataTransfer: DataTransfer): File[] {
  const files: File[] = [];
  
  for (let i = 0; i < dataTransfer.files.length; i++) {
    const file = dataTransfer.files[i];
    if (isImageFile(file)) {
      files.push(file);
    }
  }
  
  return files;
}