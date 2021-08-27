import { BaseEntity } from '@/types';

export type Team = {
  name: string;
  description: string;
} & BaseEntity;
