import { axios } from '@/lib/axios';

import { Comment } from '../types';

type GetDiscussionCommentsOptions = {
  discussionId: string;
};
export const getDiscussionComments = ({
  discussionId,
}: GetDiscussionCommentsOptions): Promise<Comment[]> => {
  return axios.get(`/comments`, {
    params: {
      discussionId,
    },
  });
};

type CommentBody = {
  body: string;
  discussionId: string;
};

type CreateCommentOptions = {
  data: CommentBody;
};

export const createComment = ({ data }: CreateCommentOptions): Promise<Comment> => {
  return axios.post('/comments', data);
};

type DeleteCommentOptions = {
  commentId: string;
};

export const deleteComment = ({ commentId }: DeleteCommentOptions) => {
  return axios.delete(`/comments/${commentId}`);
};
