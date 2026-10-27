import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AddressCard } from '../../src/components/AddressCard';
import { makeAddress } from '../../test-utils/fixtures';

describe('AddressCard', () => {
    it('affiche le nom, la description et le badge public', () => {
        render(<AddressCard address={makeAddress()} isMine />);

        expect(screen.getByText('Boulangerie du coin')).toBeTruthy();
        expect(screen.getByText('Le meilleur croissant du quartier')).toBeTruthy();
        expect(screen.getByText('Publique')).toBeTruthy();
    });

    it('affiche le badge privé', () => {
        render(<AddressCard address={makeAddress({ isPublic: false })} isMine />);
        expect(screen.getByText('Privée')).toBeTruthy();
    });

    it('affiche l’auteur uniquement pour les adresses des autres', () => {
        const { rerender } = render(<AddressCard address={makeAddress()} isMine />);
        expect(screen.queryByText('par Seraphin')).toBeNull();

        rerender(<AddressCard address={makeAddress()} isMine={false} />);
        expect(screen.getByText('par Seraphin')).toBeTruthy();
    });

    it('propose la suppression seulement si onDelete est fourni', () => {
        const onDelete = jest.fn();
        const { rerender } = render(<AddressCard testID="card" address={makeAddress()} isMine />);
        expect(screen.queryByTestId('card-delete')).toBeNull();

        rerender(<AddressCard testID="card" address={makeAddress()} isMine onDelete={onDelete} />);
        fireEvent.press(screen.getByTestId('card-delete'));
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('ouvre le détail au clic', () => {
        const onPress = jest.fn();
        render(<AddressCard testID="card" address={makeAddress()} isMine onPress={onPress} />);
        fireEvent.press(screen.getByTestId('card'));
        expect(onPress).toHaveBeenCalled();
    });
});