import { createProject } from '@/testing/data-generators';
import {
  renderApp,
  screen,
  userEvent,
  waitFor,
  within,
} from '@/testing/test-utils';

import { default as ProjectsRoute } from '../projects';

test('should create and render projects', { timeout: 10000 }, async () => {
  await renderApp(<ProjectsRoute />);

  const newProject = createProject();

  expect(await screen.findByText(/no entries/i)).toBeInTheDocument();

  await userEvent.click(
    screen.getByRole('button', { name: /create project/i }),
  );

  const drawer = await screen.findByRole('dialog', {
    name: /create project/i,
  });

  const nameField = within(drawer).getByText(/name/i);
  const descriptionField = within(drawer).getByText(/description/i);

  await userEvent.type(nameField, newProject.name);
  await userEvent.type(descriptionField, newProject.description);

  const submitButton = within(drawer).getByRole('button', {
    name: /submit/i,
  });

  await userEvent.click(submitButton);

  await waitFor(() => expect(drawer).not.toBeInTheDocument());

  expect(
    await screen.findByRole(
      'cell',
      {
        name: newProject.name,
      },
      { timeout: 5000 },
    ),
  ).toBeInTheDocument();

  expect(
    await screen.findByRole('cell', {
      name: newProject.description,
    }),
  ).toBeInTheDocument();
});
