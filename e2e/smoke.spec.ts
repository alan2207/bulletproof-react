import { test } from '@playwright/test';

import { userGenerator, discussionGenerator, commentGenerator } from '../src/test/data-generators';
test('smoke', async ({ page }) => {
  const user = userGenerator();
  const discussion = discussionGenerator({
    authorId: user.id,
  });
  const comment = commentGenerator({
    authorId: user.id,
  });

  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Get started' }).click();

  // registration:
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByLabel('First Name').click();
  await page.getByLabel('First Name').fill('test-name');
  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill('test-lastname');
  await page.getByLabel('Email Address').click();
  await page.getByLabel('Email Address').fill('test@mail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('Test123!@#');
  await page.getByLabel('Team Name').click();
  await page.getByLabel('Team Name').fill('Team');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('heading', { name: 'Dashboard' }).click();
  await page.getByRole('heading', { name: 'Welcome test-name test-' }).click();

  // log out:
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();

  // log in:
  await page.getByLabel('Email Address').click();
  await page.getByLabel('Email Address').fill('test@mail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('Test123!@#');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('heading', { name: 'Welcome test-name test-' }).click();

  // create discussion:

  await page.getByRole('link', { name: 'Discussions' }).click();
  await page.getByRole('button', { name: 'Create Discussion' }).click();
  await page.getByLabel('Title').click();
  await page.getByLabel('Title').fill('discussion title');
  await page.getByLabel('Body').click();
  await page.getByLabel('Body').fill('discussion body');
  await page.getByRole('button', { name: 'Submit' }).click();

  // visit discussion page:
  await page.getByRole('link', { name: 'View' }).click();

  await page.getByRole('heading', { name: 'discussion title' }).click();
  await page.getByText('discussion body').click();

  // update discussion:

  await page.getByRole('button', { name: 'Update Discussion' }).click();
  await page.getByLabel('Title').click();
  await page.getByLabel('Title').fill('discussion title - updated');
  await page.getByLabel('Body').click();
  await page.getByLabel('Body').fill('discussion body - updated');
  await page.getByRole('button', { name: 'Submit' }).click();

  // create comment:

  await page.getByRole('button', { name: 'Create Comment' }).click();
  await page.getByLabel('Body').click();
  await page.getByLabel('Body').fill('test comment');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('test comment').click();

  // delete comment:

  await page.getByRole('button', { name: 'Delete Comment' }).click();
  await page.getByRole('button', { name: 'Delete Comment' }).click();
  await page.getByRole('heading', { name: 'No Comments Found' }).click();

  // go back to discussions:

  await page.goto('http://localhost:3000/app/discussions');

  // delete discussion:

  await page.getByRole('button', { name: 'Delete Discussion' }).click();
  await page.getByRole('button', { name: 'Delete Discussion' }).click();
  await page.getByRole('heading', { name: 'No Entries Found' }).click();

  // update user:

  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Your Profile' }).click();
  await page.getByRole('button', { name: 'Update Profile' }).click();
  await page.getByLabel('Bio').click();
  await page.getByLabel('Bio').fill('bio added');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('bio added').click();
  await page.getByText('User UpdatedClose').click();
});
