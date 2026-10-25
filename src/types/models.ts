export type Coords = {
    latitude: number;
    longitude: number;
};

export type Address = {
    id: string;
    ownerId: string;
    ownerName: string;
    name: string;
    description: string;
    photoURL: string | null;
    isPublic: boolean;
    latitude: number;
    longitude: number;
    createdAt: Date | null;
};

export type Comment = {
    id: string;
    authorId: string;
    authorName: string;
    text: string;
    rating: number;
    photoURL: string | null;
    createdAt: Date | null;
};