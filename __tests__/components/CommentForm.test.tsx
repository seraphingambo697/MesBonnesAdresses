import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { CommentForm } from '../../src/components/CommentForm';

describe('CommentForm', () => {
    it('affiche les erreurs et n’envoie rien si le formulaire est vide', () => {
        const onSubmit = jest.fn();
        render(<CommentForm onSubmit={onSubmit} />);

        fireEvent.press(screen.getByTestId('comment-submit'));

        expect(screen.getByText('Choisis une note entre 1 et 5 étoiles')).toBeTruthy();
        expect(screen.getByText("Écris quelques mots sur l'adresse")).toBeTruthy();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('envoie la note et le texte puis réinitialise le formulaire', async () => {
        const onSubmit = jest.fn(() => Promise.resolve());
        render(<CommentForm onSubmit={onSubmit} />);

        fireEvent.press(screen.getByTestId('comment-rating-4'));
        fireEvent.changeText(screen.getByTestId('comment-text'), 'Très bonne adresse');
        fireEvent.press(screen.getByTestId('comment-submit'));

        await waitFor(() =>
            expect(onSubmit).toHaveBeenCalledWith({
                text: 'Très bonne adresse',
                rating: 4,
                photoURL: null,
            }),
        );
        await waitFor(() => expect(screen.getByTestId('comment-text').props.value).toBe(''));
    });
});