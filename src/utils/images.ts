import type { ImageMetadata } from 'astro';

// Get all images from assets directory and subdirectories
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif,webp}',
  { eager: true }
);

// Placeholder image
export const placeholderImage = {
  src: 'https://placehold.co/1200x800/222222/ffffff?text=Image+Not+Found',
  width: 1200,
  height: 800,
  format: 'webp',
} as ImageMetadata;

export async function getImageData(
  src: string | ImageMetadata
): Promise<ImageMetadata> {
  try {
    if (typeof src === 'string') {
      if (src.startsWith('http')) {
        return {
          src,
          width: 1200,
          height: 800,
          format: 'webp',
        } as ImageMetadata;
      } else if (src.startsWith('/')) {
        // Map public path to internal path
        const imagePath = `/src/assets${src}`;
        return images[imagePath]?.default || placeholderImage;
      }
    } else {
      // Already an ImageMetadata object
      return src;
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }

  return placeholderImage;
}

// Function to handle image load errors including 403
export function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  console.error(`Failed to load image: ${img.src}`);

  // Replace with placeholder image on error
  img.src = placeholderImage.src;
  img.width = placeholderImage.width;
  img.height = placeholderImage.height;
}
