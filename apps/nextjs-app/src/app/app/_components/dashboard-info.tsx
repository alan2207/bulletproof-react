'use client';

import { useUser } from '@/lib/auth';

export const DashboardInfo = () => {
  const user = useUser();

  if (!user.data) return null;

  const isAdmin = user.data?.role === 'ADMIN';
  const isUser = user.data?.role === 'USER';

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">
          Welcome back, {`${user.data?.firstName} ${user.data?.lastName}`}! 👋
        </h1>
        <div className="mt-3 flex items-center gap-2">
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-lg font-medium">Role: {user.data?.role}</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="size-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">
            Available Features
          </h2>
        </div>
        <p className="mb-4 text-gray-600">
          In this application you can:
        </p>
        {isUser && (
          <ul className="space-y-2">
            <li className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <svg
                className="size-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create comments in discussions</span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <svg
                className="size-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete own comments</span>
            </li>
          </ul>
        )}
        {isAdmin && (
          <ul className="space-y-2">
            <li className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <svg
                className="size-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create discussions</span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <svg
                className="size-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit discussions</span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <svg
                className="size-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete discussions</span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <svg
                className="size-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Comment on discussions</span>
            </li>
            <li className="flex items-center gap-3 rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
              <svg
                className="size-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete all comments</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
