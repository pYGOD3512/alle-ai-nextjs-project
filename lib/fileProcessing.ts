import mammoth from 'mammoth';

export async function processFile(file: File): Promise<{ text: string }> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    switch (file.type) {
      // Text-based files
      case 'text/plain':
        const textContent = await file.text();
        return { text: textContent };

      // Word documents
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const wordBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: wordBuffer });
        return { text: result.value };

      // Images - just return a placeholder
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
        return { text: `[Image: ${file.name}]` };

      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process file');
  }
}