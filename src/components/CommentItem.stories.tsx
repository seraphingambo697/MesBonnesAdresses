import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { CommentItem } from './CommentItem';
import { makeComment } from '../../test-utils/fixtures';

const meta: Meta<typeof CommentItem> = {
  title: 'Composants/CommentItem',
  component: CommentItem,
  args: { comment: makeComment() },
};
export default meta;

type Story = StoryObj<typeof CommentItem>;

export const ParDefaut: Story = {};

export const AvecPhoto: Story = {
  args: { comment: makeComment({ photoURL: 'https://picsum.photos/id/292/400/300', rating: 5 }) },
};

export const Supprimable: Story = { args: { canDelete: true, onDelete: fn() } };

export const MauvaiseNote: Story = {
  args: { comment: makeComment({ rating: 1, text: 'Service très lent, je déconseille.' }) },
};
