// Limite de sécurité : un document Firestore ne peut pas dépasser 1 Mo
export const MAX_IMAGE_BYTES = 700 * 1024;

export function getDataUriSize(dataUri: string): number {
    const base64 = dataUri.split(',')[1] ?? '';
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    return Math.floor((base64.length * 3) / 4) - padding;
}

export function isImageSizeValid(dataUri: string): boolean {
    return getDataUriSize(dataUri) <= MAX_IMAGE_BYTES;
}

export function assertImageSize(dataUri: string): void {
    if (!isImageSizeValid(dataUri)) {
        throw new Error('Image trop lourde (700 Ko maximum)');
    }
}