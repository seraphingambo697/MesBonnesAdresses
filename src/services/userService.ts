import { doc, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import { assertImageSize } from './imageUtils';

export type UserProfile = {
    displayName: string;
    photoURL: string | null;
};

export async function updateProfilePhoto(uid: string, dataUri: string): Promise<void> {
    assertImageSize(dataUri);
    await setDoc(doc(db, 'users', uid), { photoURL: dataUri }, { merge: true });
}

// Écoute le profil en temps réel
export function subscribeUserProfile(
    uid: string,
    onChange: (profile: UserProfile | null) => void,
): Unsubscribe {
    return onSnapshot(
        doc(db, 'users', uid),
        (snap) => onChange(snap.exists() ? (snap.data() as UserProfile) : null),
        () => onChange(null),
    );
}