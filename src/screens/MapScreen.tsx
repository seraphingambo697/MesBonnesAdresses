import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    MapView,
    Camera,
    UserLocation,
    MarkerView,
} from '@maplibre/maplibre-react-native';
import { useAddresses } from '../context/AddressesContext';
import { AddressCard } from '../components/AddressCard';
import { requestLocationPermission } from '../services/location';
import { OSM_STYLE } from '../config/mapStyle';
import {
    DEFAULT_CENTER,
    DEFAULT_ZOOM,
    STREET_ZOOM,
    toLngLat,
    fromLngLat,
    addressesToFeatureCollection,
} from '../utils/geo';
import { Address, Coords } from '../types/models';
import { AppStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type UserLocationUpdate = { coords: { latitude: number; longitude: number } };
type Nav = NativeStackNavigationProp<AppStackParamList>;

const OTHERS_COLOR = '#1E88E5';

export function MapScreen() {
    const navigation = useNavigation<Nav>();
    const { myAddresses, othersAddresses } = useAddresses();
    const cameraRef = useRef<any>(null);
    const hasCenteredOnce = useRef(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [userCoords, setUserCoords] = useState<Coords | null>(null);
    const [selected, setSelected] = useState<Address | null>(null);

    useEffect(() => {
        requestLocationPermission().then(setHasPermission);
    }, []);

    const shape = useMemo(
        () => addressesToFeatureCollection(myAddresses, othersAddresses),
        [myAddresses, othersAddresses],
    );

    // Si l'adresse sélectionnée est supprimée, on ferme la fiche
    useEffect(() => {
        if (!selected) return;
        const stillExists = [...myAddresses, ...othersAddresses].some((a) => a.id === selected.id);
        if (!stillExists) setSelected(null);
    }, [myAddresses, othersAddresses, selected]);

    const centerOn = useCallback((coords: Coords, zoom = STREET_ZOOM) => {
        cameraRef.current?.setCamera({
            centerCoordinate: toLngLat(coords),
            zoomLevel: zoom,
            animationDuration: 600,
        });
    }, []);

    const onUserLocationUpdate = (location: UserLocationUpdate) => {
        const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        setUserCoords(coords);

        if (!hasCenteredOnce.current) {
            hasCenteredOnce.current = true;
            centerOn(coords);
        }
    };

    const openCreate = (coords: Coords) => navigation.navigate('CreateAddress', coords);

    const onRecenter = () => {
        if (userCoords) centerOn(userCoords);
        else Alert.alert('Position', 'Localisation en cours… Vérifie que le GPS est activé.');
    };

    const onAdd = () => {
        if (userCoords) openCreate(userCoords);
        else Alert.alert('Position inconnue', 'Fais un appui long sur la carte pour choisir un emplacement.');
    };

    const onLongPress = (feature: any) => {
        const lngLat = feature?.geometry?.coordinates;
        if (Array.isArray(lngLat) && lngLat.length >= 2) {
            openCreate(fromLngLat([lngLat[0], lngLat[1]]));
        }
    };

    // Appui sur un marqueur
    const onMarkerPress = (event: any) => {
        const id = event?.features?.[0]?.properties?.id;
        const address = [...myAddresses, ...othersAddresses].find((a) => a.id === id);
        if (address) setSelected(address);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                testID="map-view"
                style={StyleSheet.absoluteFill}
                mapStyle={OSM_STYLE}
                logoEnabled={false}
                attributionEnabled
                attributionPosition={{ bottom: 8, left: 8 }}
                onLongPress={onLongPress}
            >
                <Camera
                    ref={cameraRef}
                    defaultSettings={{
                        centerCoordinate: toLngLat(DEFAULT_CENTER),
                        zoomLevel: DEFAULT_ZOOM,
                    }}
                />

                {myAddresses.map((a) => (
                    <MarkerView key={`mine-${a.id}`} coordinate={toLngLat(a)} anchor={{ x: 0.5, y: 0.5 }} allowOverlap>
                        <Pressable testID={`marker-${a.id}`} onPress={() => setSelected(a)} hitSlop={8}>
                            <View style={[styles.marker, { backgroundColor: colors.primary }]} />
                        </Pressable>
                    </MarkerView>
                ))}

                {othersAddresses.map((a) => (
                    <MarkerView key={`other-${a.id}`} coordinate={toLngLat(a)} anchor={{ x: 0.5, y: 0.5 }} allowOverlap>
                        <Pressable testID={`marker-${a.id}`} onPress={() => setSelected(a)} hitSlop={8}>
                            <View style={[styles.marker, { backgroundColor: OTHERS_COLOR }]} />
                        </Pressable>
                    </MarkerView>
                ))}

                {hasPermission && <UserLocation visible animated onUpdate={onUserLocationUpdate} />}
            </MapView>

            {!hasPermission && (
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>
                        Localisation refusée : active-la dans les paramètres pour centrer la carte sur ta position.
                    </Text>
                </View>
            )}

            <View style={styles.legend}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Mes adresses</Text>
                <View style={[styles.dot, { backgroundColor: OTHERS_COLOR }]} />
                <Text style={styles.legendText}>Communauté</Text>
            </View>

            {selected ? (
                <View style={styles.preview}>
                    <AddressCard
                        testID="map-selected-address"
                        address={selected}
                        isMine={selected.ownerId === myAddresses[0]?.ownerId || myAddresses.some((a) => a.id === selected.id)}
                        onPress={() => navigation.navigate('AddressDetail', { addressId: selected.id })}
                    />
                    <Pressable style={styles.closePreview} onPress={() => setSelected(null)} hitSlop={10}>
                        <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                </View>
            ) : (
                <>
                    <Pressable testID="recenter-button" style={[styles.fab, styles.fabSecondary]} onPress={onRecenter}>
                        <Text style={styles.fabIcon}>🎯</Text>
                    </Pressable>
                    <Pressable testID="add-address-button" style={[styles.fab, styles.fabPrimary]} onPress={onAdd}>
                        <Text style={[styles.fabIcon, styles.fabIconPrimary]}>＋</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    marker: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 3,
        borderColor: colors.white,
        elevation: 4,
    },
    banner: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        right: spacing.md,
        backgroundColor: colors.danger,
        padding: spacing.md,
        borderRadius: 10,
    },
    bannerText: { color: colors.white, fontSize: 13 },
    legend: {
        position: 'absolute',
        top: spacing.xl,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
        gap: 6,
        elevation: 3,
    },
    dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.white },
    legendText: { fontSize: 12, color: colors.text, marginRight: spacing.sm },
    preview: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md },
    closePreview: {
        position: 'absolute',
        top: -12,
        right: -6,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.text,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: { color: colors.white, fontWeight: '700' },
    fab: {
        position: 'absolute',
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    fabPrimary: { bottom: spacing.lg, backgroundColor: colors.primary },
    fabSecondary: { bottom: spacing.lg + 72, backgroundColor: colors.white },
    fabIcon: { fontSize: 24 },
    fabIconPrimary: { color: colors.white, fontWeight: '700' },
});