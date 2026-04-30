'use client';

import { Home, PanelLeft, Folder, Users, User2 } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';
import { useLogout, useUser } from '@/lib/auth';
import { cn } from '@/utils/cn';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const Logo = () => {
  return (
    <Link className="flex items-center text-white" href={paths.home.getHref()}>
      <img className="h-8 w-auto" src="/logo.svg" alt="Workflow" />
      <span className="text-sm font-semibold text-white">
        Bulletproof React
      </span>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout({
    onSuccess: () => router.push(paths.auth.login.getHref(pathname)),
  });
  const navigation = [
    { name: 'Dashboard', to: paths.app.root.getHref(), icon: Home },
    { name: 'Discussions', to: paths.app.discussions.getHref(), icon: Folder },
    user.data?.role === 'ADMIN' && {
      name: 'Users',
      to: paths.app.users.getHref(),
      icon: Users,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-black sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <div className="flex h-16 shrink-0 items-center px-4">
            <Logo />
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.to;
            return (
              <NextLink
                key={item.name}
                href={item.to}
                className={cn(
                  'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium',
                  isActive && 'bg-gray-900 text-white',
                )}
              >
                <item.icon
                  className={cn(
                    'text-gray-400 group-hover:text-gray-300',
                    'mr-4 size-6 shrink-0',
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </NextLink>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:justify-end sm:border-0 sm:bg-transparent sm:px-6">
          {/* <Progress /> */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent
              side="left"
              className="bg-black pt-10 text-white sm:max-w-60"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <div className="flex h-16 shrink-0 items-center px-4">
                  <Logo />
                </div>
                {navigation.map((item) => {
                  const isActive = pathname === item.to;
                  return (
                    <NextLink
                      key={item.name}
                      href={item.to}
                      className={cn(
                        'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium',
                        isActive && 'bg-gray-900 text-white',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'text-gray-400 group-hover:text-gray-300',
                          'mr-4 size-6 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </NextLink>
                  );
                })}
              </nav>
            </DrawerContent>
          </Drawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <span className="sr-only">Open user menu</span>
                <User2 className="size-6 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(paths.app.profile.getHref())}
                className={cn('block px-4 py-2 text-sm text-gray-700')}
              >
                Your Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn('block px-4 py-2 text-sm text-gray-700 w-full')}
                onClick={() => logout.mutate()}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function Fallback({ error }: { error: Error }) {
  return <p>Error: {error.message ?? 'Something went wrong!'}</p>;
}

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <Layout>
      <ErrorBoundary key={pathname} FallbackComponent={Fallback}>
        {children}
      </ErrorBoundary>
    </Layout>
  );
};
