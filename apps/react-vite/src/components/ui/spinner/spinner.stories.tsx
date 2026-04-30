import { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
  component: Spinner,
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};
