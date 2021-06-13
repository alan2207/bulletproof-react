import { Meta, Story } from '@storybook/react';

import { MainLayout } from './MainLayout';

const meta: Meta = {
  title: 'Layouts/MainLayout',
  component: MainLayout,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (props) => <MainLayout {...props}>Hello</MainLayout>;

export const Default = Template.bind({});
Default.args = {};
