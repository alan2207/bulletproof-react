import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Layout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useTeams } from '@/features/teams/api/get-teams';

export const RegisterRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [chooseTeam, setChooseTeam] = useState(false);

  const teamsQuery = useTeams({
    queryConfig: {
      enabled: chooseTeam,
    },
  });

  return (
    <Layout title="Register your account">
      <RegisterForm
        onSuccess={() =>
          navigate(`${redirectTo ? `${redirectTo}` : '/app'}`, {
            replace: true,
          })
        }
        chooseTeam={chooseTeam}
        setChooseTeam={() => setChooseTeam(!chooseTeam)}
        teams={teamsQuery.data}
      />
    </Layout>
  );
};
