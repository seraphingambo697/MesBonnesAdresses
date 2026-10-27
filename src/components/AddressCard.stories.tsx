import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { AddressCard } from './AddressCard';
import { makeAddress } from '../../test-utils/fixtures';

const meta: Meta<typeof AddressCard> = {
  title: 'Composants/AddressCard',
  component: AddressCard,
  args: { address: makeAddress(), isMine: true, onPress: fn() },
};
export default meta;

type Story = StoryObj<typeof AddressCard>;

export const MaPublique: Story = {};

export const MaPriveeSupprimable: Story = {
  args: { address: makeAddress({ isPublic: false, name: 'Mon coin secret' }), onDelete: fn() },
};

export const AdresseDUnAutre: Story = {
  args: { address: makeAddress({ ownerName: 'Alice' }), isMine: false },
};

export const AvecPhoto: Story = {
  args: { address: makeAddress({ photoURL: 'https://picsum.photos/id/42/300/300' }) },
};

export const DescriptionLongue: Story = {
  args: {
    address: makeAddress({
      description:
        'Une très longue description pour vérifier que le texte est bien tronqué sur deux lignes dans la carte, sans casser la mise en page.',
    }),
  },
};
