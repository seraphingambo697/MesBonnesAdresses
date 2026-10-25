import { Address, Coords } from '../types/models';

export type LngLat = [number, number];

export const DEFAULT_CENTER: Coords = { latitude: 48.8566, longitude: 2.3522 };
export const DEFAULT_ZOOM = 11;
export const STREET_ZOOM = 15;

// MapLibre attend [longitude, latitude]
export function toLngLat(coords: Coords): LngLat {
    return [coords.longitude, coords.latitude];
}

export function fromLngLat([longitude, latitude]: LngLat): Coords {
    return { latitude, longitude };
}

export function isValidCoords(coords?: Partial<Coords> | null): coords is Coords {
    return (
        !!coords &&
        typeof coords.latitude === 'number' &&
        typeof coords.longitude === 'number' &&
        coords.latitude >= -90 &&
        coords.latitude <= 90 &&
        coords.longitude >= -180 &&
        coords.longitude <= 180
    );
}

// Adresse -> point GeoJSON affichable par MapLibre
export function addressToFeature(address: Address, isMine: boolean) {
    return {
        type: 'Feature' as const,
        id: address.id,
        geometry: { type: 'Point' as const, coordinates: toLngLat(address) },
        properties: { id: address.id, mine: isMine, isPublic: address.isPublic },
    };
}

export function addressesToFeatureCollection(mine: Address[], others: Address[]) {
    return {
        type: 'FeatureCollection' as const,
        features: [
            ...mine.filter(isValidCoords).map((a) => addressToFeature(a, true)),
            ...others.filter(isValidCoords).map((a) => addressToFeature(a, false)),
        ],
    };
}