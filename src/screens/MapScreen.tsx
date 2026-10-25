import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { MapView, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import { requestLocationPermission } from '../services/location';
import { OSM_STYLE } from '../config/mapStyle';
import { DEFAULT_CENTER, DEFAULT_ZOOM, STREET_ZOOM, toLngLat } from '../utils/geo';
import { Coords } from '../types/models';
import { colors, spacing } from '../theme';

type UserLocationUpdate = { coords: { latitude: number; longitude: number } };

export function MapScreen() {
    const cameraRef = useRef<any>(null);
    const hasCenteredOnce = useRef(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [userCoords, setUserCoords] = useState<Coords | null>(null);

    useEffect(() => {
        requestLocationPermission().then(setHasPermission);
    }, []);

    const centerOn = useCallback((coords: Coords) => {
        cameraRef.current?.setCamera({
            centerCoordinate: toLngLat(coords),
            zoomLevel: STREET_ZOOM,
            animationDuration: 600,
        });
    }, []);

    // Appelé à chaque nouvelle position GPS
    const onUserLocationUpdate = (location: UserLocationUpdate) => {
        const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        setUserCoords(coords);

        // Centrage automatique au premier point reçu
        if (!hasCenteredOnce.current) {
            hasCenteredOnce.current = true;
            centerOn(coords);
        }
    };

    const onRecenter = () => {
        if (userCoords) centerOn(userCoords);
        else Alert.alert('Position', 'Localisation en cours… Vérifie que le GPS est activé.');
    };

    const onAdd = () => {
        Alert.alert('Bientôt', "La création d'adresse arrive à l'étape suivante.");
    };

    // On attend la réponse à la permission avant d'afficher la carte
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
            >
                <Camera
                    ref={cameraRef}
                    defaultSettings={{
                        centerCoordinate: toLngLat(DEFAULT_CENTER),
                        zoomLevel: DEFAULT_ZOOM,
                    }}
                />

                {hasPermission && (
                    <UserLocation visible animated onUpdate={onUserLocationUpdate} />
                )}
            </MapView>

            {!hasPermission && (
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>
                        Localisation refusée : active-la dans les paramètres pour centrer la carte sur ta position.
                    </Text>
                </View>
            )}

            <Pressable testID="recenter-button" style={[styles.fab, styles.fabSecondary]} onPress={onRecenter}>
                <Text style={styles.fabIcon}>🎯</Text>
            </Pressable>

            <Pressable testID="add-address-button" style={[styles.fab, styles.fabPrimary]} onPress={onAdd}>
                <Text style={[styles.fabIcon, styles.fabIconPrimary]}>＋</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
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