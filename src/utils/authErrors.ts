const messages: Record<string, string> = {
  'auth/email-already-in-use': 'Cette adresse e-mail est déjà utilisée',
  'auth/invalid-email': 'Adresse e-mail invalide',
  'auth/weak-password': 'Mot de passe trop faible (6 caractères minimum)',
  'auth/invalid-credential': 'E-mail ou mot de passe incorrect',
  'auth/user-not-found': 'E-mail ou mot de passe incorrect',
  'auth/wrong-password': 'E-mail ou mot de passe incorrect',
  'auth/too-many-requests': 'Trop de tentatives, réessaie plus tard',
  'auth/network-request-failed': 'Problème de connexion réseau',
};

export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  return messages[code] ?? 'Une erreur est survenue';
}
