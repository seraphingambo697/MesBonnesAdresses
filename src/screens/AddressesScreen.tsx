import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAddresses } from '../context/AddressesContext';
import { AddressCard } from '../components/AddressCard';
import { confirmDeleteAddress } from '../components/confirmDeleteAddress';
import { AppStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Segment = 'mine' | 'others';

export function AddressesScreen() {
    const navigation = useNavigation<Nav>();
    const { myAddresses, othersAddresses, loading, error } = useAddresses();
    const [segment, setSegment] = useState<Segment>('mine');

    const data = segment === 'mine' ? myAddresses : othersAddresses;
    const isMine = segment === 'mine';

    return (
        <View style={styles.container}>
            <View style={styles.segmented}>
                <Pressable
                    testID="segment-mine"
                    style={[styles.segment, isMine && styles.segmentActive]}
                    onPress={() => setSegment('mine')}
                >
                    <Text style={[styles.segmentText, isMine && styles.segmentTextActive]}>
                        Mes adresses ({myAddresses.length})
                    </Text>
                </Pressable>
                <Pressable
                    testID="segment-others"
                    style={[styles.segment, !isMine && styles.segmentActive]}
                    onPress={() => setSegment('others')}
                >
                    <Text style={[styles.segmentText, !isMine && styles.segmentTextActive]}>
                        Communauté ({othersAddresses.length})
                    </Text>
                </Pressable>
            </View>

            {error && <Text style={styles.error}>⚠️ {error}</Text>}

            {loading ? (
                <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
            ) : (
                <FlatList
                    testID="addresses-list"
                    data={data}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <AddressCard
                            testID={`address-card-${item.id}`}
                            address={item}
                            isMine={isMine}
                            onPress={() => navigation.navigate('AddressDetail', { addressId: item.id })}
                            onDelete={isMine ? () => confirmDeleteAddress(item) : undefined}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            {isMine
                                ? "Tu n'as encore aucune adresse.\nAjoute-en une depuis la carte avec ＋."
                                : "Aucune adresse publique partagée par d'autres utilisateurs pour l'instant."}
                        </Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    segmented: {
        flexDirection: 'row',
        margin: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 4,
    },
    segment: { flex: 1, paddingVertical: spacing.sm, borderRadius: 8, alignItems: 'center' },
    segmentActive: { backgroundColor: colors.primary },
    segmentText: { fontWeight: '600', color: colors.textMuted },
    segmentTextActive: { color: colors.white },
    list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    loader: { marginTop: spacing.xl },
    empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl, lineHeight: 22 },
    error: { color: colors.danger, marginHorizontal: spacing.md, marginBottom: spacing.sm, fontSize: 12 },
});