import 'react-markdown-editor-lite/lib/index.css';
import { Spinner } from '@/components/Elements';
import { MDPreview } from '@/components/Elements/MDPreview';
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
    <div className="flex flex-col space-y-3">
      {commentsQuery.data.map((comment) => (
        <div key={comment.id} className="w-full bg-white shadow-sm p-4">
          {comment.authorId === user?.id && (
            <div className="flex justify-end">
              <DeleteComment discussionId={discussionId} id={comment.id} />
            </div>
          )}
          <MDPreview value={comment.body} />
        </div>
      ))}
    </div>
  );
};
