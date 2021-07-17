import { BaseEntity } from '@/types';

export type Comment = {
  id: string;
  body: string;
  authorId: string;
  discussionId: string;
} & BaseEntity;
