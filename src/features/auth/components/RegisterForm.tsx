import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { Form, InputField, SelectField } from '@/components/Form';
import { getTeams } from '@/features/teams';
import { useAuth } from '@/lib/auth';

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId?: string;
  teamName?: string;
};

export const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [chooseTeam, setChooseTeam] = useState(false);

  const { data: teamData } = useQuery({
    queryKey: 'teams',
    queryFn: () => {
      return getTeams();
    },
    enabled: chooseTeam,
  });

  return (
    <div>
      <Form<RegisterValues>
        onSubmit={async (values) => {
          await register(values);
          navigate('/app');
        }}
      >
        {({ register }) => (
          <>
            <InputField
              name="firstName"
              type="text"
              label="First Name"
              registration={register('firstName')}
            />
            <InputField
              name="lastName"
              type="text"
              label="Last Name"
              registration={register('lastName')}
            />
            <InputField
              name="email"
              type="email"
              label="Email Address"
              registration={register('email')}
            />
            <InputField
              name="password"
              type="password"
              label="Password"
              registration={register('password')}
            />
            {!chooseTeam && (
              <InputField
                name="teamName"
                type="text"
                label="Team Name"
                registration={register('teamName')}
              />
            )}
            <Switch.Group>
              <div className="flex items-center">
                <Switch
                  checked={chooseTeam}
                  onChange={setChooseTeam}
                  className={`${
                    chooseTeam ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <span
                    className={`${
                      chooseTeam ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  />
                </Switch>
                <Switch.Label className="ml-4">Join Existing Team</Switch.Label>
              </div>
            </Switch.Group>

            {chooseTeam && teamData && (
              <SelectField
                label="Team"
                name="teamId"
                registration={register('teamId')}
                options={teamData?.map((team) => ({
                  label: team.name,
                  value: team.id,
                }))}
              />
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log in
              </button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link to="../login" className="font-medium text-blue-600 hover:text-blue-500">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
