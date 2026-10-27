jest.mock('../../src/config/firebase', () => ({ db: {} }));

jest.mock('firebase/firestore', () => ({
    addDoc: jest.fn(() => Promise.resolve({ id: 'com-id' })),
    collection: jest.fn(() => 'comments-col'),
    deleteDoc: jest.fn(() => Promise.resolve()),
    doc: jest.fn(() => 'comment-ref'),
    onSnapshot: jest.fn(),
    orderBy: jest.fn(),
    query: jest.fn(),
    serverTimestamp: jest.fn(() => 'SERVER_TS'),
}));

import { addComment, deleteComment, mapComment } from '../../src/services/commentService';

const firestore = jest.requireMock('firebase/firestore');

beforeEach(() => jest.clearAllMocks());

describe('addComment', () => {
    it('enregistre un avis dans la sous-collection de l’adresse', async () => {
        await addComment('addr-1', { uid: 'u2', displayName: 'Alice' }, {
            text: '  Top  ',
            rating: 4.4,
            photoURL: null,
        });

        expect(firestore.collection).toHaveBeenCalledWith({}, 'addresses', 'addr-1', 'comments');
        expect(firestore.addDoc).toHaveBeenCalledWith('comments-col', {
            authorId: 'u2',
            authorName: 'Alice',
            text: 'Top',
            rating: 4, // arrondi à l'entier exigé par les règles Firestore
            photoURL: null,
            createdAt: 'SERVER_TS',
        });
    });
});

describe('deleteComment', () => {
    it('supprime le bon document', async () => {
        await deleteComment('addr-1', 'com-1');
        expect(firestore.doc).toHaveBeenCalledWith({}, 'addresses', 'addr-1', 'comments', 'com-1');
        expect(firestore.deleteDoc).toHaveBeenCalledWith('comment-ref');
    });
});
