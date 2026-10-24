import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { validateRegister, hasErrors, FormErrors, RegisterForm } from '../../utils/validators';
import { getAuthErrorMessage } from '../../utils/authErrors';
import { AuthStackParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterForm>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors<RegisterForm>>({});
  const [loading, setLoading] = useState(false);

  const update = (key: keyof RegisterForm) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async () => {
    const validation = validateRegister(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setLoading(true);
    try {
      await register(form.displayName, form.email, form.password);
    } catch (e) {
      Alert.alert('Inscription impossible', getAuthErrorMessage(e));
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Créer un compte</Text>

          <AppInput
            testID="register-name"
            label="Pseudo"
            value={form.displayName}
            onChangeText={update('displayName')}
            error={errors.displayName}
          />
          <AppInput
            testID="register-email"
            label="E-mail"
            value={form.email}
            onChangeText={update('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <AppInput
            testID="register-password"
            label="Mot de passe"
            value={form.password}
            onChangeText={update('password')}
            secureTextEntry
            error={errors.password}
          />
          <AppInput
            testID="register-confirm"
            label="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChangeText={update('confirmPassword')}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <AppButton testID="register-submit" title="S'inscrire" onPress={onSubmit} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <Pressable testID="go-login" onPress={() => navigation.goBack()}>
              <Text style={styles.link}>Se connecter</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
});
