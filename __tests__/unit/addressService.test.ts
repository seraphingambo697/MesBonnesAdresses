jest.mock('../../src/config/firebase', () => ({ db: {} }));

jest.mock('firebase/firestore', () => ({
    addDoc: jest.fn(() => Promise.resolve({ id: 'new-id' })),
    collection: jest.fn(() => 'addresses-col'),
    doc: jest.fn(() => 'address-ref'),
    getDocs: jest.fn(),
    onSnapshot: jest.fn(),
    orderBy: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    writeBatch: jest.fn(),
    serverTimestamp: jest.fn(() => 'SERVER_TS'),
}));

import { mapAddress, createAddress, deleteAddress } from '../../src/services/addressService';

const firestore = jest.requireMock('firebase/firestore');

beforeEach(() => jest.clearAllMocks());

describe('mapAddress', () => {
    it('convertit un document Firestore en Address', () => {
        const date = new Date('2026-10-25');
        const address = mapAddress('id1', {
            ownerId: 'u1',
            name: 'Café',
            isPublic: 1,
            latitude: 1,
            longitude: 2,
            createdAt: { toDate: () => date },
        });
        expect(address).toMatchObject({
            id: 'id1',
            ownerId: 'u1',
            ownerName: 'Anonyme',
            description: '',
            photoURL: null,
            isPublic: true,
            createdAt: date,
        });
    });
});

describe('createAddress', () => {
    const owner = { uid: 'u1', displayName: 'Seraphin' };
    const input = {
        name: '  Café  ',
        description: ' Bon café ',
        isPublic: true,
        photoURL: null,
        latitude: 48.8,
        longitude: 2.3,
    };

    it('enregistre une adresse nettoyée avec le bon propriétaire', async () => {
        const id = await createAddress(owner, input);

        expect(id).toBe('new-id');
        expect(firestore.addDoc).toHaveBeenCalledWith('addresses-col', {
            ownerId: 'u1',
            ownerName: 'Seraphin',
            name: 'Café',
            description: 'Bon café',
            photoURL: null,
            isPublic: true,
            latitude: 48.8,
            longitude: 2.3,
            createdAt: 'SERVER_TS',
        });
    });

    it('refuse une photo trop lourde sans écrire en base', async () => {
        const heavy = `data:image/jpeg;base64,${'A'.repeat(1_000_000)}`;
        await expect(createAddress(owner, { ...input, photoURL: heavy })).rejects.toThrow('Image trop lourde');
        expect(firestore.addDoc).not.toHaveBeenCalled();
    });
});

describe('deleteAddress', () => {
    it('supprime l’adresse et tous ses commentaires en un seul batch', async () => {
        const batch = { delete: jest.fn(), commit: jest.fn(() => Promise.resolve()) };
        firestore.writeBatch.mockReturnValue(batch);
        firestore.getDocs.mockResolvedValue({
            forEach: (cb: (d: { ref: string }) => void) => [{ ref: 'c1' }, { ref: 'c2' }].forEach(cb),
        });

        await deleteAddress('addr-1');

        expect(batch.delete).toHaveBeenCalledWith('c1');
        expect(batch.delete).toHaveBeenCalledWith('c2');
        expect(batch.delete).toHaveBeenCalledWith('address-ref');
        expect(batch.commit).toHaveBeenCalledTimes(1);
    });
});