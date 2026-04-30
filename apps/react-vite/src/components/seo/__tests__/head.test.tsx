import { render, waitFor } from '@/testing/test-utils';

import { Head } from '../head';

test('should add proper page title and meta description', async () => {
  const title = 'Hello World';
  const titleSuffix = ' | Bulletproof React';
  const description = 'This is a description';

  render(<Head title={title} description={description} />);
  await waitFor(() => expect(document.title).toEqual(title + titleSuffix));

  const metaDescription = document.querySelector("meta[name='description']");

  expect(metaDescription?.getAttribute('content')).toEqual(description);
});
