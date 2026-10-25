import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { chooseImage } from '../services/imagePicker';
import { colors, spacing } from '../theme';

export type ImagePickerFieldProps = {
    label?: string;
    value: string | null;
    onChange: (dataUri: string | null) => void;
    testID?: string;
};

export function ImagePickerField({ label = 'Photo', value, onChange, testID }: ImagePickerFieldProps) {
    const onPick = async () => {
        try {
            const image = await chooseImage();
            if (image) onChange(image.dataUri);
        } catch (e: any) {
            Alert.alert('Erreur', e?.message ?? "Impossible de récupérer l'image");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            {value ? (
                <View>
                    <Image source={{ uri: value }} style={styles.preview} />
                    <View style={styles.actions}>
                        <Pressable onPress={onPick} testID={testID ? `${testID}-change` : undefined}>
                            <Text style={styles.link}>Changer</Text>
                        </Pressable>
                        <Pressable onPress={() => onChange(null)} testID={testID ? `${testID}-remove` : undefined}>
                            <Text style={[styles.link, styles.danger]}>Retirer</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <Pressable testID={testID} onPress={onPick} style={styles.placeholder}>
                    <Text style={styles.placeholderIcon}>📷</Text>
                    <Text style={styles.placeholderText}>Ajouter une photo</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: spacing.md },
    label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: spacing.xs },
    placeholder: {
        height: 140,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderIcon: { fontSize: 32 },
    placeholderText: { color: colors.textMuted, marginTop: spacing.xs },
    preview: { width: '100%', height: 200, borderRadius: 12, backgroundColor: colors.surface },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.lg, marginTop: spacing.sm },
    link: { color: colors.primary, fontWeight: '600' },
    danger: { color: colors.danger },
});