import { ArchiveX } from 'lucide-react';

import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { POLICIES, Authorization } from '@/lib/authorization';
import { User } from '@/types/api';
import { formatDate } from '@/utils/format';

import { useComments } from '../api/get-comments';

import { DeleteComment } from './delete-comment';

type CommentsListProps = {
  discussionId: string;
};

export const CommentsList = ({ discussionId }: CommentsListProps) => {
  const user = useUser();
  const commentsQuery = useComments({ discussionId });

  if (commentsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!commentsQuery?.data?.length)
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
    <ul aria-label="comments" className="flex flex-col space-y-3">
      {commentsQuery.data.map((comment, index) => (
        <li
          aria-label={`comment-${comment.body}-${index}`}
          key={comment.id || index}
          className="w-full bg-white p-4 shadow-sm"
        >
          <Authorization
            policyCheck={POLICIES['comment:delete'](user.data as User, comment)}
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
              <DeleteComment discussionId={discussionId} id={comment.id} />
            </div>
          </Authorization>

          <MDPreview value={comment.body} />
        </li>
      ))}
    </ul>
  );
};
