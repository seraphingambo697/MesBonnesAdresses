import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from '../../src/screens/auth/RegisterScreen';

const mockRegister = jest.fn();
jest.mock('../../src/context/AuthContext', () => ({
    useAuth: () => ({ register: mockRegister }),
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() } as any;
const renderScreen = () => render(<RegisterScreen navigation={navigation} route={{} as any} />);

beforeEach(() => jest.clearAllMocks());

describe('RegisterScreen', () => {
    const fill = (password: string, confirm: string) => {
        fireEvent.changeText(screen.getByTestId('register-name'), 'Seraphin');
        fireEvent.changeText(screen.getByTestId('register-email'), 'seraphin@mail.com');
        fireEvent.changeText(screen.getByTestId('register-password'), password);
        fireEvent.changeText(screen.getByTestId('register-confirm'), confirm);
    };

    it('refuse des mots de passe différents', () => {
        renderScreen();
        fill('secret1', 'secret2');
        fireEvent.press(screen.getByTestId('register-submit'));

        expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeTruthy();
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('crée le compte avec un formulaire valide', async () => {
        mockRegister.mockResolvedValue(undefined);
        renderScreen();
        fill('secret1', 'secret1');
        fireEvent.press(screen.getByTestId('register-submit'));

        await waitFor(() =>
            expect(mockRegister).toHaveBeenCalledWith('Seraphin', 'seraphin@mail.com', 'secret1'),
        );
    });

    it('revient à la connexion', () => {
        renderScreen();
        fireEvent.press(screen.getByTestId('go-login'));
        expect(navigation.goBack).toHaveBeenCalled();
    });
});