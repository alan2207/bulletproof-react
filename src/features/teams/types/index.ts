import { BaseEntity } from '@/types';

export type Team = {
  id: string;
  name: string;
  description: string;
} & BaseEntity;
