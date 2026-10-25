import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { subscribeAddress } from '../services/addressService';
import { confirmDeleteAddress } from '../components/confirmDeleteAddress';
import { AppButton } from '../components/AppButton';
import { formatDate } from '../utils/format';
import { Address } from '../types/models';
import { AppStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'AddressDetail'>;

export function AddressDetailScreen({ route, navigation }: Props) {
    const { addressId } = route.params;
    const { user } = useAuth();
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        return subscribeAddress(
            addressId,
            (a) => {
                setAddress(a);
                setNotFound(!a);
                setLoading(false);
            },
            () => {
                // permission-denied = adresse privée d'un autre utilisateur
                setNotFound(true);
                setLoading(false);
            },
        );
    }, [addressId]);

    useLayoutEffect(() => {
        navigation.setOptions({ title: address?.name ?? 'Adresse' });
    }, [navigation, address]);

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />;
    }

    if (notFound || !address) {
        return (
            <View style={styles.center}>
                <Text style={styles.muted}>Cette adresse n'existe plus ou n'est pas accessible.</Text>
            </View>
        );
    }

    const isOwner = address.ownerId === user?.uid;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {address.photoURL ? (
                <Image testID="address-detail-photo" source={{ uri: address.photoURL }} style={styles.photo} />
            ) : (
                <View style={[styles.photo, styles.photoPlaceholder]}>
                    <Text style={styles.photoIcon}>📍</Text>
                </View>
            )}

            <View style={styles.section}>
                <Text testID="address-detail-name" style={styles.name}>
                    {address.name}
                </Text>

                <View style={styles.metaRow}>
                    <View style={[styles.badge, address.isPublic ? styles.badgePublic : styles.badgePrivate]}>
                        <Text style={styles.badgeText}>{address.isPublic ? '🌍 Publique' : '🔒 Privée'}</Text>
                    </View>
                    <Text style={styles.muted}>
                        {isOwner ? 'Ton adresse' : `par ${address.ownerName}`}
                        {address.createdAt ? ` · ${formatDate(address.createdAt)}` : ''}
                    </Text>
                </View>

                {!!address.description && <Text style={styles.description}>{address.description}</Text>}

                <Text style={styles.coords}>
                    📍 {address.latitude.toFixed(5)}, {address.longitude.toFixed(5)}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Avis</Text>
                <Text style={styles.muted}>Les avis et photos des utilisateurs arrivent à l'étape suivante.</Text>
            </View>

            {isOwner && (
                <View style={styles.section}>
                    <AppButton
                        testID="address-delete-button"
                        title="Supprimer cette adresse"
                        variant="danger"
                        onPress={() => confirmDeleteAddress(address, () => navigation.goBack())}
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: spacing.xl },
    loader: { marginTop: spacing.xl },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
    photo: { width: '100%', height: 240, backgroundColor: colors.surface },
    photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    photoIcon: { fontSize: 56 },
    section: { padding: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    name: { fontSize: 24, fontWeight: '700', color: colors.text },
    metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
    badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 10 },
    badgePublic: { backgroundColor: '#E3F2FD' },
    badgePrivate: { backgroundColor: '#FFF3E0' },
    badgeText: { fontSize: 12, color: colors.text },
    description: { fontSize: 16, color: colors.text, marginTop: spacing.md, lineHeight: 22 },
    coords: { fontSize: 13, color: colors.textMuted, marginTop: spacing.md },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
    muted: { color: colors.textMuted, fontSize: 13 },
});