import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { AppInput } from './AppInput';

const meta: Meta<typeof AppInput> = {
  title: 'Composants/AppInput',
  component: AppInput,
  args: { label: 'E-mail', placeholder: 'exemple@mail.com' },
};
export default meta;

type Story = StoryObj<typeof AppInput>;

export const ParDefaut: Story = {};
export const Rempli: Story = { args: { value: 'seraphin@mail.com' } };
export const AvecErreur: Story = { args: { value: 'pasunmail', error: 'Adresse e-mail invalide' } };
export const MotDePasse: Story = { args: { label: 'Mot de passe', secureTextEntry: true, value: 'secret123' } };
