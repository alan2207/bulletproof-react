import * as React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, Input, Select, Label, Switch } from '@/components/ui/form';
import { useTeams } from '@/features/teams';

import { useRegister } from '../lib/auth';

const schema = z
  .object({
    email: z.string().min(1, 'Required'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
  })
  .and(
    z
      .object({
        teamId: z.string().min(1, 'Required'),
      })
      .or(z.object({ teamName: z.string().min(1, 'Required') }))
  );

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId?: string;
  teamName?: string;
};

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registering = useRegister();
  const [chooseTeam, setChooseTeam] = React.useState(false);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const teamsQuery = useTeams({
    config: {
      enabled: chooseTeam,
    },
  });

  return (
    <div>
      <Form<RegisterValues, typeof schema>
        onSubmit={async (values) => {
          await registering.mutateAsync(values);
          onSuccess();
        }}
        schema={schema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <>
            <Input
              type="text"
              label="First Name"
              error={formState.errors['firstName']}
              registration={register('firstName')}
            />
            <Input
              type="text"
              label="Last Name"
              error={formState.errors['lastName']}
              registration={register('lastName')}
            />
            <Input
              type="email"
              label="Email Address"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <Input
              type="password"
              label="Password"
              error={formState.errors['password']}
              registration={register('password')}
            />

            <div className="flex items-center space-x-2">
              <Switch
                checked={chooseTeam}
                onCheckedChange={setChooseTeam}
                className={`${
                  chooseTeam ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                id="choose-team"
              />
              <Label htmlFor="airplane-mode">Join Existing Team</Label>
            </div>

            {chooseTeam && teamsQuery.data ? (
              <Select
                label="Team"
                error={formState.errors['teamId']}
                registration={register('teamId')}
                options={teamsQuery?.data?.map((team) => ({
                  label: team.name,
                  value: team.id,
                }))}
              />
            ) : (
              <Input
                type="text"
                label="Team Name"
                error={formState.errors['teamName']}
                registration={register('teamName')}
              />
            )}
            <div>
              <Button isLoading={registering.isPending} type="submit" className="w-full">
                Register
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to={`/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
