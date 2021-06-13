import { Meta, Story } from '@storybook/react';

import { Button } from '../Elements';

import { Form } from './Form';
import { InputField } from './InputField';

type FormValues = {
  email: string;
  password: string;
};

const MyForm = () => {
  return (
    <Form<FormValues>
      onSubmit={async (values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ register, formState }) => (
        <>
          <InputField
            type="email"
            label="Email Address"
            error={formState.errors['email']}
            registration={register('email')}
          />
          <InputField
            type="password"
            label="Password"
            error={formState.errors['password']}
            registration={register('password')}
          />
          <div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

const meta: Meta = {
  title: 'Forms/Form',
  component: MyForm,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <MyForm />;

export const Default = Template.bind({});
Default.args = {};
