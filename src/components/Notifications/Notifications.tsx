/* This example requires Tailwind CSS v2.0+ */
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

import { useNotificationStore } from '@/hooks/useNotificationStore';

const icons = {
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />,
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />,
  warning: <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />,
};

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="z-50 flex flex-col fixed inset-0 space-y-4 items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="w-full flex flex-col items-center space-y-4 sm:items-end"
          >
            {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
            <Transition
              show={true}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">{icons[notification.type]}</div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          dismissNotification(notification.id);
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        ))}
      </div>
    </>
  );
};
