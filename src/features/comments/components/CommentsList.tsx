import 'react-markdown-editor-lite/lib/index.css';
import { Spinner, MDPreview } from '@/components/Elements';
import { useAuth } from '@/lib/auth';

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
          aria-label={`comment-${comment.id || index}`}
          key={comment.id || index}
          className="w-full bg-white shadow-sm p-4"
        >
          {comment.authorId === user?.id && (
            <div className="flex justify-end">
              <DeleteComment discussionId={discussionId} id={comment.id} />
            </div>
          )}
          <MDPreview value={comment.body} />
        </li>
      ))}
    </ul>
  );
};
