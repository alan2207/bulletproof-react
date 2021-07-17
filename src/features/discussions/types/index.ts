import { BaseEntity } from '@/types';

export type Discussion = {
  id: string;
  title: string;
  body: string;
  teamId: string;
} & BaseEntity;
