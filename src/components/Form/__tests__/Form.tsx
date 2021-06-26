import * as React from 'react';

import { Button } from '@/components/Elements/Button';
import { rtlRender, screen, waitFor, userEvent } from '@/test/test-utils';

import { Form } from '../Form';
import { InputField } from '../InputField';

test('should render and submit a basic Form component', async () => {
  const handleSubmit = jest.fn();

  const testData = {
    title: 'Hello World',
  };

  rtlRender(
    <Form<typeof testData> onSubmit={handleSubmit} id="my-form">
      {({ register, formState }) => (
        <>
          <InputField
            label="Title"
            error={formState.errors['title']}
            registration={register('title')}
          />

          <Button name="submit" type="submit" className="w-full">
            Submit
          </Button>
        </>
      )}
    </Form>
  );

  userEvent.type(screen.getByLabelText(/title/i), testData.title);

  userEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith(testData, expect.anything()));
});
