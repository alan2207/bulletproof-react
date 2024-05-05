import { Pen } from 'lucide-react';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useUser } from '@/features/auth';

import { UpdateProfileDTO, useUpdateProfile } from '../api/updateProfile';

const schema = z.object({
  email: z.string().min(1, 'Required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  bio: z.string(),
});

export const UpdateProfile = () => {
  const user = useUser();
  const updateProfileMutation = useUpdateProfile();

  return (
    <FormDrawer
      isDone={updateProfileMutation.isSuccess}
      triggerButton={
        <Button icon={<Pen className="size-4" />} size="sm">
          Update Profile
        </Button>
      }
      title="Update Profile"
      submitButton={
        <Button
          form="update-profile"
          type="submit"
          size="sm"
          isLoading={updateProfileMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form<UpdateProfileDTO['data'], typeof schema>
        id="update-profile"
        onSubmit={async (values) => {
          await updateProfileMutation.mutateAsync({ data: values });
        }}
        options={{
          defaultValues: {
            firstName: user.data?.firstName,
            lastName: user.data?.lastName,
            email: user.data?.email,
            bio: user.data?.bio,
          },
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <Input
              label="First Name"
              error={formState.errors['firstName']}
              registration={register('firstName')}
            />
            <Input
              label="Last Name"
              error={formState.errors['lastName']}
              registration={register('lastName')}
            />
            <Input
              label="Email Address"
              type="email"
              error={formState.errors['email']}
              registration={register('email')}
            />

            <Textarea label="Bio" error={formState.errors['bio']} registration={register('bio')} />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
