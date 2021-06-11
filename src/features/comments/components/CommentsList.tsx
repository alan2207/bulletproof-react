import 'react-markdown-editor-lite/lib/index.css';
import { Spinner } from '@/components/Elements';
import { MDPreview } from '@/components/Elements/MDPreview';

import { useDiscussionComments } from '../hooks/useDiscussionComments';

type CommentsListProps = {
  discussionId: string;
};

export const CommentsList = ({ discussionId }: CommentsListProps) => {
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
          <MDPreview value={comment.body} />
        </div>
      ))}
    </div>
  );
};
