import { discussionGenerator } from '@/test/data-generators';
import { render, screen, userEvent, waitFor, within } from '@/test/test-utils';

import { Discussions } from '../Discussions';

test('should create and render discussions', async () => {
  await render(<Discussions />);

  const newDiscussion = discussionGenerator();

  expect(await screen.findByText(/no entries/i)).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /create discussion/i }));

  const drawer = screen.getByRole('dialog', {
    name: /create discussion/i,
  });

  const titleField = within(drawer).getByText(/title/i);
  const bodyField = within(drawer).getByText(/body/i);

  userEvent.type(titleField, newDiscussion.title);
  userEvent.type(bodyField, newDiscussion.body);

  const submitButton = within(drawer).getByRole('button', {
    name: /submit/i,
  });

  userEvent.click(submitButton);

  await waitFor(() => expect(drawer).not.toBeInTheDocument());

  expect(
    screen.getByRole('cell', {
      name: newDiscussion.title,
    })
  ).toBeInTheDocument();
});
