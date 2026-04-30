'use client';

import { ArchiveX } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { canDeleteComment } from '@/lib/authorization';
import { formatDate } from '@/utils/format';

import { useInfiniteComments } from '../api/get-comments';

import { DeleteComment } from './delete-comment';

type CommentsListProps = {
  discussionId: string;
};

export const CommentsList = ({ discussionId }: CommentsListProps) => {
  const user = useUser();
  const commentsQuery = useInfiniteComments({ discussionId });
  const pathname = usePathname();
  const isPublicView = pathname?.startsWith?.('/public/');

  if (commentsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const comments = commentsQuery.data?.pages.flatMap((page) => page.data);

  if (!comments?.length)
    return (
      <div
        role="list"
        aria-label="comments"
        className="flex h-40 flex-col items-center justify-center bg-white text-gray-500"
      >
        <ArchiveX className="size-10" />
        <h4>No Comments Found</h4>
      </div>
    );

  return (
    <>
      <ul aria-label="comments" className="flex flex-col space-y-3">
        {comments.map((comment, index) => (
          <li
            aria-label={`comment-${comment.body}-${index}`}
            key={comment.id || index}
            className="w-full bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between">
              <div>
                <span className="text-xs font-semibold">
                  {formatDate(comment.createdAt)}
                </span>
                {comment.author && (
                  <span className="text-xs font-bold">
                    {' '}
                    by {comment.author.firstName} {comment.author.lastName}
                  </span>
                )}
              </div>
              {!isPublicView && canDeleteComment(user.data, comment) && (
                <DeleteComment discussionId={discussionId} id={comment.id} />
              )}
            </div>
            <MDPreview value={comment.body} />
          </li>
        ))}
      </ul>
      {commentsQuery.hasNextPage && (
        <div className="flex items-center justify-center py-4">
          <Button onClick={() => commentsQuery.fetchNextPage()}>
            {commentsQuery.isFetchingNextPage ? (
              <Spinner />
            ) : (
              'Load More Comments'
            )}
          </Button>
        </div>
      )}
    </>
  );
};
