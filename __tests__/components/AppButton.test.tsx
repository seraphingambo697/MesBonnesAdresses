import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AppButton } from '../../src/components/AppButton';

describe('AppButton', () => {
    it('affiche le titre et déclenche onPress', () => {
        const onPress = jest.fn();
        render(<AppButton testID="btn" title="Valider" onPress={onPress} />);

        expect(screen.getByText('Valider')).toBeTruthy();
        fireEvent.press(screen.getByTestId('btn'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('masque le titre et bloque le clic pendant le chargement', () => {
        const onPress = jest.fn();
        render(<AppButton testID="btn" title="Valider" onPress={onPress} loading />);

        expect(screen.queryByText('Valider')).toBeNull();
        fireEvent.press(screen.getByTestId('btn'));
        expect(onPress).not.toHaveBeenCalled();
    });

    it('ne réagit pas quand il est désactivé', () => {
        const onPress = jest.fn();
        render(<AppButton testID="btn" title="Valider" onPress={onPress} disabled />);

        fireEvent.press(screen.getByTestId('btn'));
        expect(onPress).not.toHaveBeenCalled();
    });
});