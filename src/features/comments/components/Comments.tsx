import { CommentsList } from './CommentsList';
import { CreateComment } from './CreateComment';

type CommentsProps = {
  discussionId: string;
};

export const Comments = ({ discussionId }: CommentsProps) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Comments:</h3>
        <CreateComment discussionId={discussionId} />
      </div>
      <CommentsList discussionId={discussionId} />
    </div>
  );
};
