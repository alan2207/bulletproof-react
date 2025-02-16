'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth/components/login-form';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo.svg"
            alt="Company Logo"
            width={300}
            height={300}
            priority
          />
        </div>
        <LoginForm
          onSuccess={() =>
            router.replace(
              `${redirectTo ? `${decodeURIComponent(redirectTo)}` : paths.app.dashboard.getHref()}`,
            )
          }
        />
      </div>
    </div>
  );
};

export default LoginPage;
