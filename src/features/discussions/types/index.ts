import { Entity } from '@/types';

export type Discussion = Entity<{
  title: string;
  body: string;
  teamId: string;
  author: Entity<{
    firstName: string;
    lastName: string;
    email: string;
    role: 'ADMIN' | 'USER';
    teamId: string;
    bio: string;
  }>;
}>;
