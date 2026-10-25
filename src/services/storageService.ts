import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

// Conversion URI locale -> Blob (méthode fiable en React Native)
export function uriToBlob(uri: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new Error("Impossible de lire l'image"));
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}

export async function uploadImage(path: string, uri: string): Promise<string> {
    const blob = await uriToBlob(uri);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
    (blob as any).close?.();
    return getDownloadURL(storageRef);
}