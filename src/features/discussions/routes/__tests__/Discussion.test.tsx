import { useParams as useMockParams } from 'react-router-dom';

import {
  render,
  screen,
  userEvent,
  waitFor,
  createDiscussion,
  createUser,
  within,
} from '@/test/test-utils';

import { Discussion } from '../Discussion';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // keep the rest of the exports intact
  useParams: jest.fn(),
}));

const renderDiscussion = async () => {
  const fakeUser = await createUser();
  const fakeDiscussion = await createDiscussion({ teamId: fakeUser.teamId });

  (useMockParams as jest.Mock).mockImplementation(() => ({
    discussionId: fakeDiscussion.id,
  }));

  const utils = await render(<Discussion />, {
    user: fakeUser,
  });

  await waitFor(() => expect(screen.getByText(fakeDiscussion.title)).toBeInTheDocument());

  return {
    ...utils,
    fakeUser,
    fakeDiscussion,
  };
};

test('should render discussion', async () => {
  const { fakeDiscussion } = await renderDiscussion();
  expect(screen.getByText(fakeDiscussion.body)).toBeInTheDocument();
});

test('should update discussion', async () => {
  const { fakeDiscussion } = await renderDiscussion();

  const titleUpdate = '-Updated';
  const bodyUpdate = '-Updated';

  userEvent.click(screen.getByRole('button', { name: /update discussion/i }));

  const drawer = screen.getByRole('dialog', {
    name: /update discussion/i,
  });

  const titleField = within(drawer).getByText(/title/i);
  const bodyField = within(drawer).getByText(/body/i);

  userEvent.type(titleField, titleUpdate);
  userEvent.type(bodyField, bodyUpdate);

  const submitButton = within(drawer).getByRole('button', {
    name: /submit/i,
  });

  userEvent.click(submitButton);

  await waitFor(() => expect(drawer).not.toBeInTheDocument());

  const newTitle = `${fakeDiscussion.title}${titleUpdate}`;
  const newBody = `${fakeDiscussion.body}${bodyUpdate}`;

  expect(screen.getByText(newTitle)).toBeInTheDocument();
  expect(screen.getByText(newBody)).toBeInTheDocument();
});
