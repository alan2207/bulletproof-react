import AppProvider from './context/AppProvider';
import { AppRoutes } from './routes';
import { makeServer } from './server';

makeServer({ environment: 'development' });

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
