declare module 'pako' {
  export function inflate(
    data: Uint8Array | ArrayBuffer, 
    options?: { 
      to?: 'string' | 'arraybuffer';
      level?: number;
      windowBits?: number;
    }
  ): string | Uint8Array;

  export function deflate(
    data: Uint8Array | ArrayBuffer | string, 
    options?: { 
      level?: number;
      windowBits?: number;
    }
  ): Uint8Array;
}
