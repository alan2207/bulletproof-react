import { Meta, Story } from '@storybook/react';

import { Dialog } from './Dialog';

const meta: Meta = {
  title: 'Elements/Dialog',
  component: Dialog,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (props) => (
  <Dialog isOpen initialFocus={{} as any} onClose={() => {}} {...props}>
    Hello
  </Dialog>
);

export const Default = Template.bind({});
Default.args = {};
