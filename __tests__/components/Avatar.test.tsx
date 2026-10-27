import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Avatar, getInitials } from '../../src/components/Avatar';

describe('getInitials', () => {
    it.each([
        ['Jean Dupont', 'JD'],
        ['marie', 'M'],
        ['Anne Marie Claire', 'AM'],
        ['   ', '?'],
        [null, '?'],
    ])('"%s" donne "%s"', (name, expected) => {
        expect(getInitials(name)).toBe(expected);
    });
});

describe('Avatar', () => {
    it('affiche les initiales sans photo', () => {
        render(<Avatar name="Seraphin Gambo" />);
        expect(screen.getByText('SG')).toBeTruthy();
    });

    it('affiche l’image quand une photo existe', () => {
        render(<Avatar testID="avatar" uri="data:image/jpeg;base64,AAAA" name="Seraphin" />);
        expect(screen.getByTestId('avatar').props.source).toEqual({ uri: 'data:image/jpeg;base64,AAAA' });
        expect(screen.queryByText('S')).toBeNull();
    });
});