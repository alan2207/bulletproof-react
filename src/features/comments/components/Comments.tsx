import { CommentsList } from './CommentsList';
import { CreateComment } from './CreateComment';

type CommentsProps = {
  discussionId: string;
};

export const Comments = ({ discussionId }: CommentsProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-1xl font-bold">Comments:</h3>
        <CreateComment discussionId={discussionId} />
      </div>
      <CommentsList discussionId={discussionId} />
    </div>
  );
};
