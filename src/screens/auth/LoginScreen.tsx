import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { validateLogin, hasErrors, FormErrors, LoginForm } from '../../utils/validators';
import { getAuthErrorMessage } from '../../utils/authErrors';
import { AuthStackParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<LoginForm>>({});
  const [loading, setLoading] = useState(false);

  const update = (key: keyof LoginForm) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async () => {
    const validation = validateLogin(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (e) {
      Alert.alert('Connexion impossible', getAuthErrorMessage(e));
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Mes Bonnes Adresses</Text>
          <Text style={styles.subtitle}>Connecte-toi pour retrouver tes adresses</Text>

          <AppInput
            testID="login-email"
            label="E-mail"
            value={form.email}
            onChangeText={update('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />
          <AppInput
            testID="login-password"
            label="Mot de passe"
            value={form.password}
            onChangeText={update('password')}
            secureTextEntry
            error={errors.password}
          />

          <AppButton testID="login-submit" title="Se connecter" onPress={onSubmit} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <Pressable testID="go-register" onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Créer un compte</Text>
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
  title: { fontSize: 28, fontWeight: '700', color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
});
