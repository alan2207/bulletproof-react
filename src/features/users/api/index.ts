import { axios } from '@/lib/axios';

import { User } from '../types';

export const getUsers = (): Promise<User[]> => {
  return axios.get(`/users`);
};

type DeleteUserOptions = {
  userId: string;
};

export const deleteUser = ({ userId }: DeleteUserOptions) => {
  return axios.delete(`/users/${userId}`);
};

type ProfileBody = {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
};

type UpdateProfileOptions = {
  data: ProfileBody;
};

export const updateProfile = ({ data }: UpdateProfileOptions) => {
  return axios.patch(`/users/profile`, data);
};
