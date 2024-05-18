import { Entity } from '@/types';

export type Comment = Entity<{
  body: string;
  discussionId: string;
  author: Entity<{
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
    teamId: string;
    bio: string;
  }>;
}>;
