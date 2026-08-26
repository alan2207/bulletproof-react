export const MainErrorFallback = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem',
      }}
      role="alert"
    >
      <h2 style={{ color: '#dc2626', margin: 0 }}>
        Ooops, something went wrong :({' '}
      </h2>
      <button type="button" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  );
};
