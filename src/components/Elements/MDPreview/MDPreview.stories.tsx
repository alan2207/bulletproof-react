import { Meta, Story } from '@storybook/react';

import { MDPreview } from './MDPreview';

const meta: Meta = {
  title: 'Elements/MDPreview',
  component: MDPreview,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (props) => <MDPreview value={`## Hello World`} {...props} />;

export const Default = Template.bind({});
Default.args = {};
