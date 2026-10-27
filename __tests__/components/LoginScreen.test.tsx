import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../src/screens/auth/LoginScreen';

const mockLogin = jest.fn();
jest.mock('../../src/context/AuthContext', () => ({
    useAuth: () => ({ login: mockLogin }),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() } as any;
const renderScreen = () => render(<LoginScreen navigation={navigation} route={{} as any} />);

beforeEach(() => jest.clearAllMocks());

describe('LoginScreen', () => {
    it('affiche les erreurs de validation sans appeler Firebase', () => {
        renderScreen();
        fireEvent.press(screen.getByTestId('login-submit'));

        expect(screen.getByText('Adresse e-mail invalide')).toBeTruthy();
        expect(screen.getByText('Le mot de passe est obligatoire')).toBeTruthy();
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('connecte l’utilisateur avec ses identifiants', async () => {
        mockLogin.mockResolvedValue(undefined);
        renderScreen();

        fireEvent.changeText(screen.getByTestId('login-email'), 'seraphin@mail.com');
        fireEvent.changeText(screen.getByTestId('login-password'), 'secret1');
        fireEvent.press(screen.getByTestId('login-submit'));

        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('seraphin@mail.com', 'secret1'));
    });

    it('affiche un message clair si les identifiants sont faux', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => { });
        mockLogin.mockRejectedValue({ code: 'auth/invalid-credential' });
        renderScreen();

        fireEvent.changeText(screen.getByTestId('login-email'), 'seraphin@mail.com');
        fireEvent.changeText(screen.getByTestId('login-password'), 'mauvais');
        fireEvent.press(screen.getByTestId('login-submit'));

        await waitFor(() =>
            expect(alertSpy).toHaveBeenCalledWith('Connexion impossible', 'E-mail ou mot de passe incorrect'),
        );
    });

    it('navigue vers l’inscription', () => {
        renderScreen();
        fireEvent.press(screen.getByTestId('go-register'));
        expect(navigation.navigate).toHaveBeenCalledWith('Register');
    });
});