import { Meta, Story } from '@storybook/react';

import { Button } from '../Button';

import { ConfirmationDialog } from './ConfirmationDialog';

const meta: Meta = {
  title: 'Elements/ConfirmationDialog',
  component: ConfirmationDialog,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (props) => (
  <ConfirmationDialog
    title="Confirmation"
    body="Hello World"
    confirmButton={<Button>Confirm</Button>}
    triggerButton={<button>Open</button>}
    {...props}
  />
);

export const Danger = Template.bind({});
Danger.args = {
  icon: 'danger',
};

export const Info = Template.bind({});
Info.args = {
  icon: 'info',
};
