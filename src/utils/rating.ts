import { Comment } from '../types/models';

// Moyenne arrondie à 0,1 près, ou null s'il n'y a aucun avis
export function averageRating(comments: Pick<Comment, 'rating'>[]): number | null {
    if (comments.length === 0) return null;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    return Math.round((sum / comments.length) * 10) / 10;
}

export function formatRating(average: number | null, count: number): string {
    if (average === null) return 'Aucun avis';
    return `${average.toFixed(1).replace('.', ',')} / 5 · ${count} avis`;
}