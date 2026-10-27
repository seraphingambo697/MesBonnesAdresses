import {
    isValidEmail,
    validateRegister,
    validateLogin,
    validateAddress,
    validateComment,
    hasErrors,
    ADDRESS_NAME_MAX,
    COMMENT_TEXT_MAX,
} from '../../src/utils/validators';

describe('isValidEmail', () => {
    it.each(['a@b.co', 'jean.dupont@supinfo.com', '  test@mail.fr  '])('accepte %s', (email) => {
        expect(isValidEmail(email)).toBe(true);
    });

    it.each(['', 'abc', 'a@b', 'a b@c.fr', '@mail.com'])('refuse "%s"', (email) => {
        expect(isValidEmail(email)).toBe(false);
    });
});

describe('validateRegister', () => {
    const valid = {
        displayName: 'Seraphin',
        email: 'seraphin@mail.com',
        password: 'secret1',
        confirmPassword: 'secret1',
    };

    it('exige 6 caractères minimum pour le mot de passe', () => {
        const errors = validateRegister({ ...valid, password: '123', confirmPassword: '123' });
        expect(errors.password).toBe('6 caractères minimum');
    });

    it('détecte des mots de passe différents', () => {
        const errors = validateRegister({ ...valid, confirmPassword: 'autre12' });
        expect(errors.confirmPassword).toBe('Les mots de passe ne correspondent pas');
    });
});

describe('validateLogin', () => {
    it('exige un e-mail valide et un mot de passe', () => {
        const errors = validateLogin({ email: 'pasunmail', password: '' });
        expect(errors.email).toBeDefined();
        expect(errors.password).toBeDefined();
    });

    it('accepte des identifiants valides', () => {
        expect(validateLogin({ email: 'a@b.fr', password: 'x' })).toEqual({});
    });
});

describe('validateAddress', () => {
    it('exige un nom', () => {
        expect(validateAddress({ name: '', description: '' }).name).toBe('Le nom est obligatoire');
    });

    it('accepte une description vide', () => {
        expect(validateAddress({ name: 'Café', description: '' })).toEqual({});
    });
});

describe('validateComment', () => {
    it('exige une note entière entre 1 et 5', () => {
        expect(validateComment({ text: 'ok', rating: 0 }).rating).toBeDefined();
        expect(validateComment({ text: 'ok', rating: 6 }).rating).toBeDefined();
        expect(validateComment({ text: 'ok', rating: 3.5 }).rating).toBeDefined();
        expect(validateComment({ text: 'ok', rating: 5 }).rating).toBeUndefined();
    });

    it('exige un texte', () => {
        expect(validateComment({ text: '  ', rating: 4 }).text).toBeDefined();
    });

    it('limite la longueur du texte', () => {
        const text = 'a'.repeat(COMMENT_TEXT_MAX + 1);
        expect(validateComment({ text, rating: 4 }).text).toBeDefined();
    });
});

describe('hasErrors', () => {
    it('détecte la présence d’erreurs', () => {
        expect(hasErrors({})).toBe(false);
        expect(hasErrors({ name: 'erreur' })).toBe(true);
    });
});