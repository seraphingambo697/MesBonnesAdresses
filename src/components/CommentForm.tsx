import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';
import { StarRating } from './StarRating';
import { ImagePickerField } from './ImagePickerField';
import {
  validateComment,
  hasErrors,
  FormErrors,
  CommentFormValues,
  COMMENT_TEXT_MAX,
} from '../utils/validators';
import { colors, spacing } from '../theme';

export type CommentFormSubmit = CommentFormValues & { photoURL: string | null };

export type CommentFormProps = {
  onSubmit: (values: CommentFormSubmit) => Promise<void>;
};

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors<CommentFormValues>>({});
  const [sending, setSending] = useState(false);

  const submit = async () => {
    const validation = validateComment({ text, rating });
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSending(true);
    try {
      await onSubmit({ text, rating, photoURL: photo });
      // Réinitialisation après envoi
      setRating(0);
      setText('');
      setPhoto(null);
      setErrors({});
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donner mon avis</Text>

      <Text style={styles.label}>Note *</Text>
      <StarRating testID="comment-rating" value={rating} onChange={setRating} size={32} />
      {!!errors.rating && <Text style={styles.error}>{errors.rating}</Text>}

      <View style={styles.spacer} />

      <AppInput
        testID="comment-text"
        label="Commentaire *"
        placeholder="Qu'as-tu pensé de cet endroit ?"
        value={text}
        onChangeText={setText}
        multiline
        maxLength={COMMENT_TEXT_MAX}
        style={styles.textarea}
        error={errors.text}
      />

      <ImagePickerField testID="comment-photo" label="Photo (facultatif)" value={photo} onChange={setPhoto} />

      <AppButton testID="comment-submit" title="Publier mon avis" onPress={submit} loading={sending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, marginTop: spacing.md },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  label: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: spacing.xs },
  error: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
  spacer: { height: spacing.md },
  textarea: { height: 90, paddingTop: spacing.sm, textAlignVertical: 'top', backgroundColor: colors.white },
});