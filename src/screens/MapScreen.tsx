import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapView, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import { requestLocationPermission } from '../services/location';
import { OSM_STYLE } from '../config/mapStyle';
import { DEFAULT_CENTER, DEFAULT_ZOOM, STREET_ZOOM, toLngLat, fromLngLat } from '../utils/geo';
import { Coords } from '../types/models';
import { AppStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type UserLocationUpdate = { coords: { latitude: number; longitude: number } };
type Nav = NativeStackNavigationProp<AppStackParamList>;

export function MapScreen() {
    const navigation = useNavigation<Nav>();
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

    const openCreate = (coords: Coords) => {
        navigation.navigate('CreateAddress', coords);
    };

    const onRecenter = () => {
        if (userCoords) centerOn(userCoords);
        else Alert.alert('Position', 'Localisation en cours… Vérifie que le GPS est activé.');
    };

    // ＋ : adresse à ma position
    const onAdd = () => {
        if (userCoords) openCreate(userCoords);
        else Alert.alert('Position inconnue', 'Fais un appui long sur la carte pour choisir un emplacement.');
    };

    // Appui long : adresse à l'endroit touché
    const onLongPress = (feature: any) => {
        const lngLat = feature?.geometry?.coordinates;
        if (Array.isArray(lngLat) && lngLat.length >= 2) {
            openCreate(fromLngLat([lngLat[0], lngLat[1]]));
        }
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

                {hasPermission && <UserLocation visible animated onUpdate={onUserLocationUpdate} />}
            </MapView>

            {!hasPermission && (
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>
                        Localisation refusée : active-la dans les paramètres pour centrer la carte sur ta position.
                    </Text>
                </View>
            )}

            <View style={styles.hint}>
                <Text style={styles.hintText}>Appui long sur la carte pour ajouter une adresse</Text>
            </View>

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
    hint: {
        position: 'absolute',
        top: spacing.xl,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
    },
    hintText: { color: colors.white, fontSize: 12 },
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