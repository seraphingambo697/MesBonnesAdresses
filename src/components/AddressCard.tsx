import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Address } from '../types/models';
import { colors, spacing } from '../theme';

export type AddressCardProps = {
    address: Address;
    isMine: boolean;
    onPress?: () => void;
    onDelete?: () => void;
    testID?: string;
};

export function AddressCard({ address, isMine, onPress, onDelete, testID }: AddressCardProps) {
    return (
        <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
            {address.photoURL ? (
                <Image source={{ uri: address.photoURL }} style={styles.thumb} />
            ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Text style={styles.thumbIcon}>📍</Text>
                </View>
            )}

            <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>
                    {address.name}
                </Text>
                {!!address.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {address.description}
                    </Text>
                )}
                <View style={styles.footer}>
                    <View style={[styles.badge, address.isPublic ? styles.badgePublic : styles.badgePrivate]}>
                        <Text style={styles.badgeText}>{address.isPublic ? '🌍 Publique' : '🔒 Privée'}</Text>
                    </View>
                    {!isMine && <Text style={styles.owner}>par {address.ownerName}</Text>}
                </View>
            </View>

            {onDelete && (
                <Pressable
                    testID={testID ? `${testID}-delete` : undefined}
                    onPress={onDelete}
                    hitSlop={10}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                </Pressable>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: spacing.sm,
        marginBottom: spacing.sm,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    pressed: { opacity: 0.85 },
    thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.surface },
    thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    thumbIcon: { fontSize: 26 },
    body: { flex: 1, marginLeft: spacing.md },
    name: { fontSize: 16, fontWeight: '600', color: colors.text },
    description: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
    footer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.sm },
    badge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 10 },
    badgePublic: { backgroundColor: '#E3F2FD' },
    badgePrivate: { backgroundColor: '#FFF3E0' },
    badgeText: { fontSize: 11, color: colors.text },
    owner: { fontSize: 12, color: colors.textMuted },
    deleteButton: { padding: spacing.sm },
    deleteIcon: { fontSize: 20 },
});