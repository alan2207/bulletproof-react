import { ArchiveIcon } from '@heroicons/react/outline';

import { Spinner, MDPreview } from '@/components/Elements';
import { User } from '@/features/users';
import { useUser } from '@/lib/auth';
import { POLICIES, Authorization } from '@/lib/authorization';
import { formatDate } from '@/utils/format';

import { useComments } from '../api/getComments';

import { DeleteComment } from './DeleteComment';

type CommentsListProps = {
  discussionId: string;
};

export const CommentsList = ({ discussionId }: CommentsListProps) => {
  const user = useUser();
  const commentsQuery = useComments({ discussionId });

  if (commentsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!commentsQuery?.data?.length)
    return (
      <div
        role="list"
        aria-label="comments"
        className="flex flex-col items-center justify-center h-40 text-gray-500 bg-white"
      >
        <ArchiveIcon className="w-10 h-10" />
        <h4>No Comments Found</h4>
      </div>
    );

  return (
    <ul aria-label="comments" className="flex flex-col space-y-3">
      {commentsQuery.data.map((comment, index) => (
        <li
          aria-label={`comment-${comment.body}-${index}`}
          key={comment.id || index}
          className="w-full p-4 bg-white shadow-sm"
        >
          <Authorization policyCheck={POLICIES['comment:delete'](user.data as User, comment)}>
            <div className="flex justify-between">
              <div>
                <span className="text-xs font-semibold">{formatDate(comment.createdAt)}</span>
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
