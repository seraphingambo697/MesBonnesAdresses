import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    DocumentData,
    Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { assertImageSize } from './imageUtils';
import { Comment } from '../types/models';

export type NewCommentInput = {
    text: string;
    rating: number;
    photoURL: string | null;
};

export type CommentAuthor = { uid: string; displayName: string };

const commentsCol = (addressId: string) => collection(db, 'addresses', addressId, 'comments');

export function mapComment(id: string, data: DocumentData): Comment {
    return {
        id,
        authorId: data.authorId,
        authorName: data.authorName ?? 'Anonyme',
        text: data.text ?? '',
        rating: data.rating ?? 0,
        photoURL: data.photoURL ?? null,
        createdAt: data.createdAt?.toDate?.() ?? null,
    };
}

export function subscribeComments(
    addressId: string,
    onData: (comments: Comment[]) => void,
    onError: (error: Error) => void,
): Unsubscribe {
    const q = query(commentsCol(addressId), orderBy('createdAt', 'desc'));
    return onSnapshot(
        q,
        (snap) =>
            onData(snap.docs.map((d) => mapComment(d.id, d.data({ serverTimestamps: 'estimate' })))),
        onError,
    );
}

export async function addComment(
    addressId: string,
    author: CommentAuthor,
    input: NewCommentInput,
): Promise<string> {
    if (input.photoURL) assertImageSize(input.photoURL);

    const ref = await addDoc(commentsCol(addressId), {
        authorId: author.uid,
        authorName: author.displayName,
        text: input.text.trim(),
        rating: Math.round(input.rating), 
        photoURL: input.photoURL,
        createdAt: serverTimestamp(),
    });

    return ref.id;
}

export async function deleteComment(addressId: string, commentId: string): Promise<void> {
    await deleteDoc(doc(db, 'addresses', addressId, 'comments', commentId));
}