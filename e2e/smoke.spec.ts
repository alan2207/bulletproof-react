import { test, expect } from '@playwright/test';

import { userGenerator, discussionGenerator, commentGenerator } from '../src/test/data-generators';
test('smoke', async ({ page }) => {
  const user = userGenerator();
  const discussion = discussionGenerator({
    authorId: user.id,
  });
  const comment = commentGenerator({
    authorId: user.id,
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Get started' }).click();

  await page.waitForURL('/auth/login');

  // registration:
  await page.getByRole('link', { name: 'Register' }).click();

  await page.waitForURL('/auth/register');
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

  await page.waitForURL('/app');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Welcome test-name test-' })).toBeVisible();

  // log out:
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await page.waitForURL('/');
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.waitForURL('/auth/login');

  // log in:
  await page.getByLabel('Email Address').click();
  await page.getByLabel('Email Address').fill('test@mail.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('Test123!@#');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome test-name test-' })).toBeVisible();

  // create discussion:

  await page.getByRole('link', { name: 'Discussions' }).click();
  await page.waitForURL('/app/discussions');

  await page.getByRole('button', { name: 'Create Discussion' }).click();
  await page.getByLabel('Title').click();
  await page.getByLabel('Title').fill('discussion title');
  await page.getByLabel('Body').click();
  await page.getByLabel('Body').fill('discussion body');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByLabel('Discussion Created').getByRole('button', { name: 'Close' }).click();

  // visit discussion page:
  await page.getByRole('link', { name: 'View' }).click();

  // todo: assert the page:
  await page.waitForTimeout(1000);
  await expect(page.getByRole('heading', { name: 'discussion title' })).toBeVisible();
  await expect(page.getByText('discussion body')).toBeVisible();

  // update discussion:

  await page.getByRole('button', { name: 'Update Discussion' }).click();
  await page.getByLabel('Title').click();
  await page.getByLabel('Title').fill('discussion title - updated');
  await page.getByLabel('Body').click();
  await page.getByLabel('Body').fill('discussion body - updated');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByLabel('Discussion Updated').getByRole('button', { name: 'Close' }).click();

  await expect(page.getByRole('heading', { name: 'discussion title - updated' })).toBeVisible();
  await expect(page.getByText('discussion body - updated')).toBeVisible();

  // create comment:
  await page.getByRole('button', { name: 'Create Comment' }).click();
  await page.getByLabel('Body').click();
  await page.getByLabel('Body').fill('test comment');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('test comment')).toBeVisible();
  await page.getByLabel('Comment Created').getByRole('button', { name: 'Close' }).click();

  // delete comment:
  await page.getByRole('button', { name: 'Delete Comment' }).click();
  await expect(page.getByText('Are you sure you want to delete this comment?')).toBeVisible();
  await page.getByRole('button', { name: 'Delete Comment' }).click();
  await page.getByLabel('Comment Deleted').getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading', { name: 'No Comments Found' })).toBeVisible();
  await expect(page.getByText('test comment')).toBeHidden();

  // go back to discussions:
  await page.getByRole('link', { name: 'Discussions' }).click();
  await page.waitForURL('/app/discussions');

  // delete discussion:
  await page.getByRole('button', { name: 'Delete Discussion' }).click();
  await page.getByRole('button', { name: 'Delete Discussion' }).click();
  await page.getByLabel('Discussion Deleted').getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading', { name: 'No Entries Found' })).toBeVisible();

  // update user:
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Your Profile' }).click();
  await page.getByRole('button', { name: 'Update Profile' }).click();
  await page.getByLabel('Bio').click();
  await page.getByLabel('Bio').fill('bio added');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByLabel('User Updated').getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('bio added')).toBeVisible();
});
