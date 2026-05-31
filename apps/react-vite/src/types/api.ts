export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
  page: number;
  total: number;
  totalPages: number;
};

export type User = Entity<{
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  teamId: string;
}>;

export type AuthResponse = {
  jwt: string;
  user: User;
};

export type Team = Entity<{
  name: string;
  description: string;
}>;

export type Discussion = Entity<{
  title: string;
  body: string;
  teamId: string;
  author: User;
}>;

export type Comment = Entity<{
  body: string;
  discussionId: string;
  author: User;
}>;
