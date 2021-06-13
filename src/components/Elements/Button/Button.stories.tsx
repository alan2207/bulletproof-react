import { Meta, Story } from '@storybook/react';

import { Button } from './Button';

const meta: Meta = {
  title: 'Elements/Button',
  component: Button,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (props) => <Button {...props}>Hello</Button>;

export const Default = Template.bind({});
Default.args = {};
