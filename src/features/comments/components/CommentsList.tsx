import { ArchiveIcon } from '@heroicons/react/outline';

import { Spinner, MDPreview } from '@/components/Elements';
import { User } from '@/features/users';
import { useAuth } from '@/lib/auth';
import { POLICIES, Authorization } from '@/lib/authorization';
import { formatDate } from '@/utils/format';

import { useComments } from '../api/getComments';

import { DeleteComment } from './DeleteComment';

type CommentsListProps = {
  discussionId: string;
};

export const CommentsList = ({ discussionId }: CommentsListProps) => {
  const { user } = useAuth();
  const commentsQuery = useComments({ discussionId });

  if (commentsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!commentsQuery?.data?.length)
    return (
      <div
        role="list"
        aria-label="comments"
        className="bg-white text-gray-500 h-40 flex justify-center items-center flex-col"
      >
        <ArchiveIcon className="h-10 w-10" />
        <h4>No Comments Found</h4>
      </div>
    );

  return (
    <ul aria-label="comments" className="flex flex-col space-y-3">
      {commentsQuery.data.map((comment, index) => (
        <li
          aria-label={`comment-${comment.body}-${index}`}
          key={comment.id || index}
          className="w-full bg-white shadow-sm p-4"
        >
          <Authorization policyCheck={POLICIES['comment:delete'](user as User, comment)}>
            <div className="flex justify-between">
              <span className="text-xs font-semibold">{formatDate(comment.createdAt)}</span>
              <DeleteComment discussionId={discussionId} id={comment.id} />
            </div>
          </Authorization>

          <MDPreview value={comment.body} />
        </li>
      ))}
    </ul>
  );
};
