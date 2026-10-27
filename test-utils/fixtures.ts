import { Address, Comment } from '../src/types/models';

export function makeAddress(overrides: Partial<Address> = {}): Address {
    return {
        id: 'addr-1',
        ownerId: 'user-1',
        ownerName: 'Seraphin',
        name: 'Boulangerie du coin',
        description: 'Le meilleur croissant du quartier',
        photoURL: null,
        isPublic: true,
        latitude: 48.8566,
        longitude: 2.3522,
        createdAt: new Date('2026-10-20T10:00:00Z'),
        ...overrides,
    };
}

export function makeComment(overrides: Partial<Comment> = {}): Comment {
    return {
        id: 'com-1',
        authorId: 'user-2',
        authorName: 'Alice',
        text: 'Super endroit',
        rating: 4,
        photoURL: null,
        createdAt: new Date('2026-10-21T10:00:00Z'),
        ...overrides,
    };
}