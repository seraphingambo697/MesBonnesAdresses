import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AppButton } from '../components/AppButton';
import { colors, spacing } from '../theme';

export function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bonjour {user?.displayName ?? ''} 👋</Text>
      <AppButton testID="logout-button" title="Se déconnecter" variant="danger" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background, gap: spacing.lg },
  text: { fontSize: 20, textAlign: 'center', color: colors.text },
});
