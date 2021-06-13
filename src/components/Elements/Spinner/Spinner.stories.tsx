import { Meta, Story } from '@storybook/react';

import { Spinner } from './Spinner';

const meta: Meta = {
  title: 'Elements/Spinner',
  component: Spinner,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (props) => <Spinner {...props} />;

export const Default = Template.bind({});
Default.args = {};
