import { Meta, Story } from '@storybook/react';
import * as React from 'react';

import { useDisclosure } from '@/hooks/useDisclosure';

import { Button } from '../Button';

import { Dialog, DialogTitle } from './Dialog';

const meta: Meta = {
  title: 'Components/Elements/Dialog',
  component: Dialog,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const Demo: Story = () => {
  const { close, open, isOpen } = useDisclosure();
  const cancelButtonRef = React.useRef(null);

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
              Modal Title
            </DialogTitle>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={close}
              ref={cancelButtonRef}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
