import { Navigate, Route, Routes } from 'react-router-dom';

import { Landing } from './Landing';

export const MiscRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};
