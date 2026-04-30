import { Comment, User } from '@/types/api';

import {
  canCreateDiscussion,
  canDeleteDiscussion,
  canUpdateDiscussion,
  canViewUsers,
  canDeleteComment,
} from '../authorization';

describe('Discussion Authorization', () => {
  const adminUser: User = {
    id: '1',
    role: 'ADMIN',
  } as User;

  const regularUser: User = {
    id: '2',
    role: 'USER',
  } as User;

  test('should allow admin to create discussions', () => {
    expect(canCreateDiscussion(adminUser)).toBe(true);
    expect(canCreateDiscussion(regularUser)).toBe(false);
    expect(canCreateDiscussion(null)).toBe(false);
    expect(canCreateDiscussion(undefined)).toBe(false);
  });

  test('should allow admin to delete discussions', () => {
    expect(canDeleteDiscussion(adminUser)).toBe(true);
    expect(canDeleteDiscussion(regularUser)).toBe(false);
    expect(canDeleteDiscussion(null)).toBe(false);
    expect(canDeleteDiscussion(undefined)).toBe(false);
  });

  test('should allow admin to update discussions', () => {
    expect(canUpdateDiscussion(adminUser)).toBe(true);
    expect(canUpdateDiscussion(regularUser)).toBe(false);
    expect(canUpdateDiscussion(null)).toBe(false);
    expect(canUpdateDiscussion(undefined)).toBe(false);
  });

  test('should allow admin to view users', () => {
    expect(canViewUsers(adminUser)).toBe(true);
    expect(canViewUsers(regularUser)).toBe(false);
    expect(canViewUsers(null)).toBe(false);
    expect(canViewUsers(undefined)).toBe(false);
  });
});

describe('Comment Authorization', () => {
  const adminUser: User = {
    id: '1',
    role: 'ADMIN',
  } as User;

  const regularUser: User = {
    id: '2',
    role: 'USER',
  } as User;

  const anotherUser: User = {
    id: '3',
    role: 'USER',
  } as User;

  test('should allow admin to delete any comment', () => {
    const comment: Comment = {
      id: '1',
      author: anotherUser,
    } as Comment;

    expect(canDeleteComment(adminUser, comment)).toBe(true);
  });

  test('should allow users to delete their own comments', () => {
    const comment: Comment = {
      id: '1',
      author: regularUser,
    } as Comment;

    expect(canDeleteComment(regularUser, comment)).toBe(true);
  });

  test('should not allow users to delete others comments', () => {
    const comment: Comment = {
      id: '1',
      author: anotherUser,
    } as Comment;

    expect(canDeleteComment(regularUser, comment)).toBe(false);
  });

  test('should not allow unauthorized users to delete comments', () => {
    const comment: Comment = {
      id: '1',
      author: regularUser,
    } as Comment;

    expect(canDeleteComment(null, comment)).toBe(false);
    expect(canDeleteComment(undefined, comment)).toBe(false);
  });
});
