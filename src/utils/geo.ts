import { Coords } from '../types/models';

export type LngLat = [number, number];

// Centre par défaut si la position n'est pas disponible : Paris
export const DEFAULT_CENTER: Coords = { latitude: 48.8566, longitude: 2.3522 };
export const DEFAULT_ZOOM = 11;
export const STREET_ZOOM = 15;

// MapLibre 
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