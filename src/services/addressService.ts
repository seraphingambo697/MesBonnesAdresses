import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { assertImageSize } from './imageUtils';

export type NewAddressInput = {
    name: string;
    description: string;
    isPublic: boolean;
    photoURL: string | null;
    latitude: number;
    longitude: number;
};

export type AddressOwner = { uid: string; displayName: string };

export async function createAddress(owner: AddressOwner, input: NewAddressInput): Promise<string> {
    if (input.photoURL) assertImageSize(input.photoURL);

    const ref = await addDoc(collection(db, 'addresses'), {
        ownerId: owner.uid,
        ownerName: owner.displayName,
        name: input.name.trim(),
        description: input.description.trim(),
        photoURL: input.photoURL,
        isPublic: input.isPublic,
        latitude: input.latitude,
        longitude: input.longitude,
        createdAt: serverTimestamp(),
    });

    return ref.id;
}