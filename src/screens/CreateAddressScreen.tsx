import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { ImagePickerField } from '../components/ImagePickerField';
import { createAddress } from '../services/addressService';
import {
    validateAddress,
    hasErrors,
    FormErrors,
    AddressForm,
    ADDRESS_DESCRIPTION_MAX,
} from '../utils/validators';
import { AppStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateAddress'>;

export function CreateAddressScreen({ route, navigation }: Props) {
    const { latitude, longitude } = route.params;
    const { user, profile } = useAuth();

    const [form, setForm] = useState<AddressForm>({ name: '', description: '' });
    const [isPublic, setIsPublic] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors<AddressForm>>({});
    const [saving, setSaving] = useState(false);

    const update = (key: keyof AddressForm) => (value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const onSave = async () => {
        if (!user) return;
        const validation = validateAddress(form);
        setErrors(validation);
        if (hasErrors(validation)) return;

        setSaving(true);
        try {
            await createAddress(
                { uid: user.uid, displayName: profile?.displayName ?? user.displayName ?? 'Anonyme' },
                { ...form, isPublic, photoURL: photo, latitude, longitude },
            );
            Alert.alert('Adresse enregistrée', isPublic ? 'Elle est visible par tous.' : 'Elle est privée.');
            navigation.goBack();
        } catch (e: any) {
            Alert.alert('Erreur', e?.message ?? "Impossible d'enregistrer l'adresse");
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.coords}>
                    📍 {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </Text>

                <AppInput
                    testID="address-name"
                    label="Nom *"
                    placeholder="Ex : Boulangerie du coin"
                    value={form.name}
                    onChangeText={update('name')}
                    error={errors.name}
                />

                <AppInput
                    testID="address-description"
                    label="Description"
                    placeholder="Pourquoi cette adresse est une bonne adresse ?"
                    value={form.description}
                    onChangeText={update('description')}
                    multiline
                    maxLength={ADDRESS_DESCRIPTION_MAX}
                    style={styles.textarea}
                    error={errors.description}
                />

                <ImagePickerField testID="address-photo" value={photo} onChange={setPhoto} />

                <View style={styles.switchRow}>
                    <View style={styles.flex}>
                        <Text style={styles.switchLabel}>{isPublic ? '🌍 Publique' : '🔒 Privée'}</Text>
                        <Text style={styles.switchHint}>
                            {isPublic
                                ? 'Visible par tous les utilisateurs'
                                : 'Visible uniquement par toi'}
                        </Text>
                    </View>
                    <Switch
                        testID="address-public-switch"
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ true: colors.primary, false: colors.border }}
                        thumbColor={colors.white}
                    />
                </View>

                <AppButton testID="address-save" title="Enregistrer l'adresse" onPress={onSave} loading={saving} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { padding: spacing.lg, backgroundColor: colors.background },
    coords: { color: colors.textMuted, marginBottom: spacing.md },
    textarea: { height: 100, paddingTop: spacing.sm, textAlignVertical: 'top' },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    switchLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
    switchHint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});