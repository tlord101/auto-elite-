import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { BrowserRouter, Navigate, Route, Routes } = ReactRouterDOM;
import MainApp from './apps/main/MainApp';
import AdminApp from './apps/admin/AdminApp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<MainApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
