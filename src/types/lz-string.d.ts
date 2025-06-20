declare module 'lz-string' {
  export function compressToUTF16(input: string): string
  export function decompressFromUTF16(compressed: string): string | null
} 