import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';

export function HomeScreen() {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bonjour {user?.displayName ?? ''} 👋</Text>
      <Text style={styles.sub}>La carte arrive à la prochaine étape.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.background },
  text: { fontSize: 20, color: colors.text },
  sub: { fontSize: 14, color: colors.textMuted, marginTop: spacing.sm },
});