import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { AppButton } from './AppButton';

const meta: Meta<typeof AppButton> = {
  title: 'Composants/AppButton',
  component: AppButton,
  args: { title: 'Enregistrer', onPress: fn() },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'danger'] },
  },
};
export default meta;

type Story = StoryObj<typeof AppButton>;

export const Primaire: Story = {};
export const Secondaire: Story = { args: { variant: 'secondary', title: 'Changer la photo' } };
export const Danger: Story = { args: { variant: 'danger', title: 'Se déconnecter' } };
export const Chargement: Story = { args: { loading: true } };
export const Desactive: Story = { args: { disabled: true } };
