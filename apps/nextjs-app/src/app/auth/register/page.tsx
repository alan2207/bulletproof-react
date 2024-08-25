'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { RegisterForm } from '@/features/auth/components/register-form';
import { useTeams } from '@/features/teams/api/get-teams';

// export const metadata = {
//   title: 'Register your account',
//   description: 'Register your account',
// };

const RegisterPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');

  const [chooseTeam, setChooseTeam] = useState(false);

  const teamsQuery = useTeams({
    queryConfig: {
      enabled: chooseTeam,
    },
  });

  return (
    <RegisterForm
      onSuccess={() =>
        router.replace(`${redirectTo ? `${redirectTo}` : '/app'}`)
      }
      chooseTeam={chooseTeam}
      setChooseTeam={() => setChooseTeam(!chooseTeam)}
      teams={teamsQuery.data?.data}
    />
  );
};

export default RegisterPage;
