'use client';

import { Link as LinkIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Link } from '@/components/ui/link';
import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { formatDate } from '@/utils/format';

import { useDiscussion } from '../api/get-discussion';
import { UpdateDiscussion } from '../components/update-discussion';

export const DiscussionView = ({ discussionId }: { discussionId: string }) => {
  const pathname = usePathname();
  const isPublicView = pathname?.startsWith?.('/public/');

  const discussionQuery = useDiscussion({
    discussionId,
  });

  if (discussionQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const discussion = discussionQuery?.data?.data;

  if (!discussion) return null;

  return (
    <div>
      <div className="flex justify-between">
        <span>
          <span className="text-xs font-bold">
            {formatDate(discussion.createdAt)}
          </span>
          {discussion.author && (
            <span className="ml-2 text-sm font-bold">
              by {discussion.author.firstName} {discussion.author.lastName}
            </span>
          )}
        </span>
        {!isPublicView && discussion.public && (
          <Link
            className="ml-2 flex items-center gap-2 text-sm font-bold"
            href={paths.public.discussion.getHref(discussionId)}
            target="_blank"
          >
            View Public Version <LinkIcon size={16} />
          </Link>
        )}
      </div>
      <div className="mt-6 flex flex-col space-y-16">
        {!isPublicView && (
          <div className="flex justify-end">
            <UpdateDiscussion discussionId={discussionId} />
          </div>
        )}
        <div>
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="mt-1 max-w-2xl text-sm text-gray-500">
                <MDPreview value={discussion.body} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
