import { User, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadImage } from './storageService';

export async function updateProfilePhoto(user: User, uri: string): Promise<string> {
    const url = await uploadImage(`users/${user.uid}/avatar.jpg`, uri);
    await updateProfile(user, { photoURL: url });
    await setDoc(doc(db, 'users', user.uid), { photoURL: url }, { merge: true });
    return url;
}