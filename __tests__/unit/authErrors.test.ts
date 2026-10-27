import { getAuthErrorMessage } from '../../src/utils/authErrors';

describe('getAuthErrorMessage', () => {
    it('traduit les codes Firebase connus', () => {
        expect(getAuthErrorMessage({ code: 'auth/email-already-in-use' })).toBe(
            'Cette adresse e-mail est déjà utilisée',
        );
        expect(getAuthErrorMessage({ code: 'auth/invalid-credential' })).toBe(
            'E-mail ou mot de passe incorrect',
        );
    });

    it('renvoie un message générique sinon', () => {
        expect(getAuthErrorMessage({ code: 'auth/inconnu' })).toBe('Une erreur est survenue');
        expect(getAuthErrorMessage(null)).toBe('Une erreur est survenue');
    });
});