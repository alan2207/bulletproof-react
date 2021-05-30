import AppProvider from './context/AppProvider';
import { makeServer } from './server';

makeServer({ environment: 'development' });

function App() {
  return <AppProvider>123</AppProvider>;
}

export default App;
