import {
    toLngLat,
    fromLngLat,
    isValidCoords,
    addressToFeature,
    addressesToFeatureCollection,
} from '../../src/utils/geo';
import { makeAddress } from '../../test-utils/fixtures';

describe('conversion de coordonnées', () => {
    it('toLngLat inverse l’ordre (MapLibre attend [lng, lat])', () => {
        expect(toLngLat({ latitude: 48.8, longitude: 2.3 })).toEqual([2.3, 48.8]);
    });

    it('fromLngLat est l’inverse de toLngLat', () => {
        const coords = { latitude: 45.76, longitude: 4.83 };
        expect(fromLngLat(toLngLat(coords))).toEqual(coords);
    });
});

describe('isValidCoords', () => {
    it('accepte des coordonnées valides', () => {
        expect(isValidCoords({ latitude: 0, longitude: 0 })).toBe(true);
        expect(isValidCoords({ latitude: -90, longitude: 180 })).toBe(true);
    });

    it('refuse des coordonnées invalides', () => {
        expect(isValidCoords(null)).toBe(false);
        expect(isValidCoords({ latitude: 91, longitude: 0 })).toBe(false);
        expect(isValidCoords({ latitude: 0, longitude: -181 })).toBe(false);
        expect(isValidCoords({ latitude: 10 })).toBe(false);
    });
});

describe('addressToFeature', () => {
    it('crée un point GeoJSON avec les bonnes propriétés', () => {
        const address = makeAddress({ id: 'x', latitude: 1, longitude: 2, isPublic: false });
        const feature = addressToFeature(address, true);
        expect(feature.geometry).toEqual({ type: 'Point', coordinates: [2, 1] });
        expect(feature.properties).toEqual({ id: 'x', mine: true, isPublic: false });
    });
});
