import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { StarRating } from '../../src/components/StarRating';

describe('StarRating', () => {
    it('affiche 5 étoiles et la note en accessibilité', () => {
        render(<StarRating testID="stars" value={3} />);
        expect(screen.getAllByText('★')).toHaveLength(5);
        expect(screen.getByLabelText('Note : 3 sur 5')).toBeTruthy();
    });

    it('renvoie la note choisie en mode saisie', () => {
        const onChange = jest.fn();
        render(<StarRating testID="stars" value={0} onChange={onChange} />);

        fireEvent.press(screen.getByTestId('stars-4'));
        expect(onChange).toHaveBeenCalledWith(4);
    });

    it('n’est pas cliquable en lecture seule', () => {
        render(<StarRating testID="stars" value={2} />);
        expect(screen.queryByTestId('stars-1')).toBeNull();
    });
});