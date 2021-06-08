import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ReactNode, Fragment, useState, useEffect, ReactElement, cloneElement } from 'react';

import { Button } from '../Elements/Button';

type FormDrawerProps = {
  isDone: boolean;
  triggerButton: ReactElement;
  submitButton: ReactElement;
  title: string;
  children: ReactNode;
};

export const FormDrawer = ({
  title,
  children,
  isDone,
  triggerButton,
  submitButton,
}: FormDrawerProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isDone) {
      setVisible(false);
    }
  }, [isDone]);

  return (
    <>
      {cloneElement(triggerButton, { onClick: () => setVisible(true) })}
      <Transition.Root show={visible} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 overflow-hidden z-50"
          open={visible}
          onClose={() => setVisible(false)}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
                    <div className="min-h-0 flex-1 flex flex-col py-6 overflow-y-scroll">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {title}
                          </Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => setVisible(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 relative flex-1 px-4 sm:px-6">{children}</div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end space-x-2">
                      <Button variant="inverse" size="sm" onClick={() => setVisible(false)}>
                        Cancel
                      </Button>
                      {submitButton}
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
