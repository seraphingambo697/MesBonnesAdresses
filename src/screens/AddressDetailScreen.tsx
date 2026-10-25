import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { subscribeAddress } from '../services/addressService';
import { subscribeComments, addComment, deleteComment } from '../services/commentService';
import { confirmDeleteAddress } from '../components/confirmDeleteAddress';
import { AppButton } from '../components/AppButton';
import { StarRating } from '../components/StarRating';
import { CommentItem } from '../components/CommentItem';
import { CommentForm, CommentFormSubmit } from '../components/CommentForm';
import { formatDate } from '../utils/format';
import { averageRating, formatRating } from '../utils/rating';
import { Address, Comment } from '../types/models';
import { AppStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'AddressDetail'>;

export function AddressDetailScreen({ route, navigation }: Props) {
    const { addressId } = route.params;
    const { user, profile } = useAuth();
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    // Adresse en temps réel
    useEffect(() => {
        return subscribeAddress(
            addressId,
            (a) => {
                setAddress(a);
                setNotFound(!a);
                setLoading(false);
            },
            () => {
                setNotFound(true);
                setLoading(false);
            },
        );
    }, [addressId]);

    // Avis en temps réel
    useEffect(() => {
        return subscribeComments(addressId, setComments, (e) => console.warn('[comments]', e.message));
    }, [addressId]);

    useLayoutEffect(() => {
        navigation.setOptions({ title: address?.name ?? 'Adresse' });
    }, [navigation, address]);

    const average = useMemo(() => averageRating(comments), [comments]);

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />;
    }

    if (notFound || !address || !user) {
        return (
            <View style={styles.center}>
                <Text style={styles.muted}>Cette adresse n'existe plus ou n'est pas accessible.</Text>
            </View>
        );
    }

    const isOwner = address.ownerId === user.uid;

    const onSubmitComment = async (values: CommentFormSubmit) => {
        try {
            await addComment(
                address.id,
                { uid: user.uid, displayName: profile?.displayName ?? user.displayName ?? 'Anonyme' },
                values,
            );
        } catch (e: any) {
            Alert.alert('Erreur', e?.message ?? "Impossible de publier l'avis");
            throw e;
        }
    };

    const onDeleteComment = (comment: Comment) => {
        Alert.alert('Supprimer cet avis ?', undefined, [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () =>
                    deleteComment(address.id, comment.id).catch((e) =>
                        Alert.alert('Erreur', e?.message ?? 'Suppression impossible'),
                    ),
            },
        ]);
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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

                    <View style={styles.ratingRow}>
                        <StarRating value={Math.round(average ?? 0)} size={18} />
                        <Text testID="address-detail-rating" style={styles.muted}>
                            {formatRating(average, comments.length)}
                        </Text>
                    </View>

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
                    <Text style={styles.sectionTitle}>Avis ({comments.length})</Text>

                    {comments.length === 0 && (
                        <Text style={styles.muted}>Aucun avis pour l'instant. Sois le premier !</Text>
                    )}

                    {comments.map((c) => (
                        <CommentItem
                            key={c.id}
                            testID={`comment-${c.id}`}
                            comment={c}
                            canDelete={c.authorId === user.uid || isOwner}
                            onDelete={() => onDeleteComment(c)}
                        />
                    ))}

                    <CommentForm onSubmit={onSubmitComment} />
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: spacing.xl },
    loader: { marginTop: spacing.xl },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
    photo: { width: '100%', height: 240, backgroundColor: colors.surface },
    photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
    photoIcon: { fontSize: 56 },
    section: { padding: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    name: { fontSize: 24, fontWeight: '700', color: colors.text },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
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