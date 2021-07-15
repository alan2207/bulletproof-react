import 'react-markdown-editor-lite/lib/index.css';
import { Spinner, MDPreview } from '@/components/Elements';
import { User } from '@/features/users';
import { useAuth } from '@/lib/auth';
import { POLICIES, Authorization } from '@/lib/authorization';

import { useDiscussionComments } from '../hooks/useDiscussionComments';

import { DeleteComment } from './DeleteComment';

type CommentsListProps = {
  discussionId: string;
};

export const CommentsList = ({ discussionId }: CommentsListProps) => {
  const { user } = useAuth();
  const commentsQuery = useDiscussionComments({ discussionId });

  if (commentsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!commentsQuery.data) return <div>No Comments</div>;

  return (
    <ul aria-label="comments" className="flex flex-col space-y-3">
      {commentsQuery.data.map((comment, index) => (
        <li
          aria-label={`comment-${comment.body}-${index}`}
          key={comment.id || index}
          className="w-full bg-white shadow-sm p-4"
        >
          <Authorization policyCheck={POLICIES['comment:delete'](user as User, comment)}>
            <div className="flex justify-end">
              <DeleteComment discussionId={discussionId} id={comment.id} />
            </div>
          </Authorization>

          <MDPreview value={comment.body} />
        </li>
      ))}
    </ul>
  );
};
