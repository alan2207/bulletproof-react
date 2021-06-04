import { axios } from '@/lib/axios';

import { Team } from '../types';

export const getMyTeam = (): Promise<Team> => {
  return axios.get('/team');
};

export const getTeams = (): Promise<Team[]> => {
  return axios.get('/teams');
};

export type TeamBody = {
  name: string;
  description: string;
};

export type UpdateTeamOptions = {
  teamId: string;
  data: TeamBody;
};

export const updateTeam = ({ teamId, data }: UpdateTeamOptions) => {
  return axios.patch(`/teams/${teamId}`, data);
};
