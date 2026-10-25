import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { AppButton } from '../components/AppButton';
import { chooseImage } from '../services/imagePicker';
import { updateProfilePhoto } from '../services/userService';
import { colors, spacing } from '../theme';

export function ProfileScreen() {
    const { user, profile, logout } = useAuth();
    const [uploading, setUploading] = useState(false);

    const displayName = profile?.displayName ?? user?.displayName ?? '';

    const onChangePhoto = async () => {
        if (!user) return;
        try {
            const image = await chooseImage();
            if (!image) return;
            setUploading(true);
            await updateProfilePhoto(user.uid, image.dataUri);
        } catch (e: any) {
            Alert.alert('Erreur', e?.message ?? 'Impossible de mettre à jour la photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable testID="profile-avatar" onPress={onChangePhoto} disabled={uploading}>
                <Avatar uri={profile?.photoURL} name={displayName} size={120} />
                {uploading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator color={colors.white} />
                    </View>
                )}
            </Pressable>
            <Text style={styles.hint}>Touchez la photo pour la modifier</Text>

            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <View style={styles.actions}>
                <AppButton
                    testID="change-photo-button"
                    title="Changer la photo de profil"
                    variant="secondary"
                    onPress={onChangePhoto}
                    loading={uploading}
                />
                <AppButton testID="logout-button" title="Se déconnecter" variant="danger" onPress={logout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xl, backgroundColor: colors.background },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 60,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: { fontSize: 12, color: colors.textMuted, marginTop: spacing.sm },
    name: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
    email: { fontSize: 15, color: colors.textMuted, marginTop: spacing.xs },
    actions: { alignSelf: 'stretch', marginTop: spacing.xl, gap: spacing.md },
});