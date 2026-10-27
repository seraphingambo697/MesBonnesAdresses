import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { StarRating } from './StarRating';

const meta: Meta<typeof StarRating> = {
  title: 'Composants/StarRating',
  component: StarRating,
  args: { value: 4, size: 24 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 5, step: 1 } } },
};
export default meta;

type Story = StoryObj<typeof StarRating>;

export const LectureSeule: Story = {};

export const Petite: Story = { args: { value: 3, size: 14 } };

function InteractiveStars() {
  const [value, setValue] = useState(0);
  return <StarRating value={value} onChange={setValue} size={36} />;
}

export const Saisie: Story = { render: () => <InteractiveStars /> };
