import { User } from '@/features/users';
import { BaseEntity } from '@/types';

export type Comment = {
  body: string;
  discussionId: string;
  author: User;
} & BaseEntity;
