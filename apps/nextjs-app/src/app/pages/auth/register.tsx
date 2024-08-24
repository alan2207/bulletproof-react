import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useTeams } from '@/features/teams/api/get-teams';

export const RegisterPage = () => {
  const router = useRouter();

  const { redirectTo } = router.query;

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

RegisterPage.getLayout = (page: ReactElement) => {
  return <AuthLayout title="Register your account">{page}</AuthLayout>;
};
