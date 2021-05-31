import { Team } from '@/features/teams';

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  team: Team;
};
