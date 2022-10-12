import { BaseEntity } from '@/types';

export type Comment = {
  body: string;
  authorId: string;
  author: string;
  discussionId: string;
} & BaseEntity;
