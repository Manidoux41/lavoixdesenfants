export const MAX_MEDIA_UPLOAD_BYTES = 4 * 1024 * 1024;

export function isValidImageUpload(
  mimeType: string,
  size: number,
  bytes: Uint8Array,
) {
  if (size <= 0 || size > MAX_MEDIA_UPLOAD_BYTES || bytes.byteLength !== size) return false;

  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return bytes.length >= 8
      && bytes[0] === 0x89
      && bytes[1] === 0x50
      && bytes[2] === 0x4e
      && bytes[3] === 0x47
      && bytes[4] === 0x0d
      && bytes[5] === 0x0a
      && bytes[6] === 0x1a
      && bytes[7] === 0x0a;
  }

  if (mimeType === "image/webp") {
    return bytes.length >= 12
      && bytes[0] === 0x52
      && bytes[1] === 0x49
      && bytes[2] === 0x46
      && bytes[3] === 0x46
      && bytes[8] === 0x57
      && bytes[9] === 0x45
      && bytes[10] === 0x42
      && bytes[11] === 0x50;
  }

  return false;
}
