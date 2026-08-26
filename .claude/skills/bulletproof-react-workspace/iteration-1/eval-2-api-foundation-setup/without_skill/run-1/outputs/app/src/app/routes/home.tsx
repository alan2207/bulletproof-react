export const HomeRoute = () => (
  <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>My App</h1>
    <p>
      The foundation is in place: validated env config, an authenticated API
      client, React Query defaults, and notifications. Features go in{' '}
      <code>src/features</code>, each with its own <code>api/</code> folder that
      calls <code>api</code> from <code>@/lib/api-client</code>.
    </p>
  </main>
);
