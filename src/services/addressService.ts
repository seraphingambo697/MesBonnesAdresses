import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
    writeBatch,
    DocumentData,
    Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { assertImageSize } from './imageUtils';
import { Address } from '../types/models';

export type NewAddressInput = {
    name: string;
    description: string;
    isPublic: boolean;
    photoURL: string | null;
    latitude: number;
    longitude: number;
};

export type AddressOwner = { uid: string; displayName: string };

const addressesCol = collection(db, 'addresses');

// Document Firestore -> objet Address
export function mapAddress(id: string, data: DocumentData): Address {
    return {
        id,
        ownerId: data.ownerId,
        ownerName: data.ownerName ?? 'Anonyme',
        name: data.name ?? '',
        description: data.description ?? '',
        photoURL: data.photoURL ?? null,
        isPublic: !!data.isPublic,
        latitude: data.latitude,
        longitude: data.longitude,
        createdAt: data.createdAt?.toDate?.() ?? null,
    };
}

export async function createAddress(owner: AddressOwner, input: NewAddressInput): Promise<string> {
    if (input.photoURL) assertImageSize(input.photoURL);

    const ref = await addDoc(addressesCol, {
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

// Mes adresses (publiques + privées)
export function subscribeMyAddresses(
    uid: string,
    onData: (addresses: Address[]) => void,
    onError: (error: Error) => void,
): Unsubscribe {
    const q = query(addressesCol, where('ownerId', '==', uid), orderBy('createdAt', 'desc'));
    return onSnapshot(
        q,
        (snap) =>
            onData(snap.docs.map((d) => mapAddress(d.id, d.data({ serverTimestamps: 'estimate' })))),
        onError,
    );
}

// Toutes les adresses publiques (les miennes incluses, filtrées ensuite)
export function subscribePublicAddresses(
    onData: (addresses: Address[]) => void,
    onError: (error: Error) => void,
): Unsubscribe {
    const q = query(addressesCol, where('isPublic', '==', true), orderBy('createdAt', 'desc'));
    return onSnapshot(
        q,
        (snap) =>
            onData(snap.docs.map((d) => mapAddress(d.id, d.data({ serverTimestamps: 'estimate' })))),
        onError,
    );
}

// Une adresse précise (écran détail)
export function subscribeAddress(
    id: string,
    onData: (address: Address | null) => void,
    onError: (error: Error) => void,
): Unsubscribe {
    return onSnapshot(
        doc(db, 'addresses', id),
        (snap) =>
            onData(snap.exists() ? mapAddress(snap.id, snap.data({ serverTimestamps: 'estimate' })) : null),
        onError,
    );
}

// Supprime l'adresse ET ses commentaires 
export async function deleteAddress(id: string): Promise<void> {
    const comments = await getDocs(collection(db, 'addresses', id, 'comments'));
    const batch = writeBatch(db);
    comments.forEach((c) => batch.delete(c.ref));
    batch.delete(doc(db, 'addresses', id));
    await batch.commit();
}