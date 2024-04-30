import { Meta, StoryFn } from '@storybook/react';
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

export const Demo: StoryFn = () => {
  const { close, open, isOpen } = useDisclosure();
  const cancelButtonRef = React.useRef(null);

  return (
    <>
      <Button onClick={open}>Open Modal</Button>
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <div className="inline-block overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
              Modal Title
            </DialogTitle>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
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
