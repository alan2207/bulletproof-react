import { BaseEntity } from '@/types';

export type Discussion = {
  title: string;
  body: string;
  teamId: string;
} & BaseEntity;
