import { supabase } from '../lib/supabase';

/**
 * Uploads an image file to Supabase Storage and returns the public URL.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - The public URL of the uploaded image.
 */
export async function uploadImage(file) {
  if (!file) throw new Error('No file provided for upload');

  // Generate a unique filename using timestamp and a random string
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `${timestamp}-${randomStr}.${extension}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
