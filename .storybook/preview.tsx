import React from 'react';
import { View } from 'react-native';
import type { Preview } from '@storybook/react-native-web-vite';

const preview: Preview = {
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <View style={{ maxWidth: 420, width: '100%' }}>
        <Story />
      </View>
    ),
  ],
};

export default preview;
