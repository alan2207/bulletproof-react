import { createUser, render, screen } from '@/test/test-utils';

import { RBAC, ROLES } from '../rbac';

test('should view protected resource if user role is matching', async () => {
  const user = await createUser({
    role: ROLES.ADMIN,
  });

  const protectedResource = 'This is very confidential data';

  await render(<RBAC allowedRoles={[ROLES.ADMIN]}>{protectedResource}</RBAC>, { user });

  expect(screen.getByText(protectedResource)).toBeInTheDocument();
});

test('should not view protected resource if user role does not match and show fallback message instead', async () => {
  const user = await createUser({
    role: ROLES.USER,
  });

  const protectedResource = 'This is very confidential data';

  const forbiddenMessage = 'You are unauthorized to view this resource';
  await render(
    <RBAC forbiddenFallback={<div>{forbiddenMessage}</div>} allowedRoles={[ROLES.ADMIN]}>
      {protectedResource}
    </RBAC>,
    { user }
  );

  expect(screen.queryByText(protectedResource)).not.toBeInTheDocument();

  expect(screen.getByText(forbiddenMessage)).toBeInTheDocument();
});

test('should view protected resource if policy check passes', async () => {
  const user = await createUser({
    role: ROLES.ADMIN,
  });

  const protectedResource = 'This is very confidential data';

  await render(<RBAC policyCheck={true}>{protectedResource}</RBAC>, { user });

  expect(screen.getByText(protectedResource)).toBeInTheDocument();
});

test('should not view protected resource if policy check fails and show fallback message instead', async () => {
  const user = await createUser({
    role: ROLES.USER,
  });

  const protectedResource = 'This is very confidential data';

  const forbiddenMessage = 'You are unauthorized to view this resource';
  await render(
    <RBAC forbiddenFallback={<div>{forbiddenMessage}</div>} policyCheck={false}>
      {protectedResource}
    </RBAC>,
    { user }
  );

  expect(screen.queryByText(protectedResource)).not.toBeInTheDocument();

  expect(screen.getByText(forbiddenMessage)).toBeInTheDocument();
});
