import { ArchiveBoxIcon } from '@heroicons/react/16/solid';
import * as React from 'react';

type TableColumn<Entry> = {
  title: string;
  field: keyof Entry;
  Cell?({ entry }: { entry: Entry }): React.ReactElement;
};

export type TableProps<Entry> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
};

export const Table = <Entry extends { id: string }>({ data, columns }: TableProps<Entry>) => {
  if (!data?.length) {
    return (
      <div className="flex h-80 flex-col items-center justify-center bg-white text-gray-500">
        <ArchiveBoxIcon className="size-16" />
        <h4>No Entries Found</h4>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.title + index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((entry, entryIndex) => (
                  <tr key={entry?.id || entryIndex} className="odd:bg-white even:bg-gray-100">
                    {columns.map(({ Cell, field, title }, columnIndex) => (
                      <td
                        key={title + columnIndex}
                        className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                      >
                        {Cell ? <Cell entry={entry} /> : `${entry[field]}`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
