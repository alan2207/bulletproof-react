import { Meta, Story } from '@storybook/react';

import { Drawer } from './Drawer';

const meta: Meta = {
  title: 'Elements/Drawer',
  component: Drawer,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (props) => (
  <Drawer isOpen onClose={() => {}} title="Hello" renderFooter={() => <div>Footer</div>} {...props}>
    Hello
  </Drawer>
);

export const Default = Template.bind({});
Default.args = {};
