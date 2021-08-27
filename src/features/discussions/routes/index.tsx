import { Navigate, Route, Routes } from 'react-router-dom';

import { Discussion } from './Discussion';
import { Discussions } from './Discussions';

export const DiscussionsRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Discussions />} />
      <Route path=":discussionId" element={<Discussion />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
