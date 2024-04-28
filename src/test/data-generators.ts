import {
  randCompanyName,
  randUserName,
  randEmail,
  randParagraph,
  randUuid,
  randPassword,
  randCatchPhrase,
} from '@ngneat/falso';
type Overrides = Record<string, any>;

export const userGenerator = (overrides?: Overrides) => ({
  id: randUuid() + Math.random(),
  firstName: randUserName({ withAccents: false }),
  lastName: randUserName({ withAccents: false }),
  email: randEmail(),
  password: randPassword(),
  teamId: randUuid(),
  teamName: randCompanyName(),
  role: 'ADMIN',
  bio: randParagraph(),
  createdAt: Date.now(),
  ...overrides,
});

export const teamGenerator = (overrides?: Overrides) => ({
  id: randUuid(),
  name: randCompanyName(),
  description: randParagraph(),
  createdAt: Date.now(),
  ...overrides,
});

export const discussionGenerator = (overrides?: Overrides) => ({
  id: randUuid(),
  title: randCatchPhrase(),
  body: randParagraph(),
  createdAt: Date.now(),
  ...overrides,
});

export const commentGenerator = (overrides?: Overrides) => ({
  id: randUuid(),
  body: randParagraph(),
  createdAt: Date.now(),
  ...overrides,
});
