import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { StarRating } from './StarRating';
import { formatDate } from '../utils/format';
import { Comment } from '../types/models';
import { colors, spacing } from '../theme';

export type CommentItemProps = {
    comment: Comment;
    canDelete?: boolean;
    onDelete?: () => void;
    testID?: string;
};

export function CommentItem({ comment, canDelete, onDelete, testID }: CommentItemProps) {
    return (
        <View testID={testID} style={styles.container}>
            <View style={styles.header}>
                <Avatar name={comment.authorName} size={36} />
                <View style={styles.headerText}>
                    <Text style={styles.author}>{comment.authorName}</Text>
                    <View style={styles.metaRow}>
                        <StarRating value={comment.rating} size={14} />
                        {comment.createdAt && <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>}
                    </View>
                </View>
                {canDelete && onDelete && (
                    <Pressable testID={testID ? `${testID}-delete` : undefined} onPress={onDelete} hitSlop={10}>
                        <Text style={styles.delete}>🗑️</Text>
                    </Pressable>
                )}
            </View>

            <Text style={styles.text}>{comment.text}</Text>

            {comment.photoURL && <Image source={{ uri: comment.photoURL }} style={styles.photo} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    header: { flexDirection: 'row', alignItems: 'center' },
    headerText: { flex: 1, marginLeft: spacing.sm },
    author: { fontWeight: '600', color: colors.text },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
    date: { fontSize: 12, color: colors.textMuted },
    delete: { fontSize: 18 },
    text: { marginTop: spacing.sm, color: colors.text, lineHeight: 20 },
    photo: { width: '100%', height: 180, borderRadius: 10, marginTop: spacing.sm, backgroundColor: colors.surface },
});