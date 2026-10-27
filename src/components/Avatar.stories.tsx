import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Composants/Avatar',
  component: Avatar,
  args: { name: 'Seraphin Gambo', size: 96 },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initiales: Story = {};
export const SansNom: Story = { args: { name: null } };
export const Petit: Story = { args: { size: 36 } };
export const AvecPhoto: Story = { args: { uri: 'https://picsum.photos/id/64/200/200' } };
