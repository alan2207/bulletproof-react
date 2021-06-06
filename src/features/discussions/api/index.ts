import { axios } from '@/lib/axios';

import { Discussion } from '../types';

export const getDiscussions = (): Promise<Discussion[]> => {
  return axios.get('/discussions');
};

type GetDiscussionOptions = {
  discussionId: string;
};

export const getDiscussion = ({ discussionId }: GetDiscussionOptions): Promise<Discussion> => {
  return axios.get(`/discussions/${discussionId}`);
};

type DiscussionBody = {
  title: string;
  description: string;
};

type CreateDiscussionOptions = {
  data: DiscussionBody;
};

export const createDiscussion = ({ data }: CreateDiscussionOptions) => {
  return axios.post(`/discussions`, data);
};

type UpdateDiscussionOptions = {
  data: DiscussionBody;
  discussionId: string;
};

export const updateDiscussion = ({ data, discussionId }: UpdateDiscussionOptions) => {
  return axios.post(`/discussions/${discussionId}`, data);
};

type DeleteDiscussionOptions = {
  discussionId: string;
};

export const deleteDiscussion = ({ discussionId }: DeleteDiscussionOptions) => {
  return axios.delete(`/discussions/${discussionId}`);
};
