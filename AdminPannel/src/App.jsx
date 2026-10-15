
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./Layout/MainLayout/MainLayout";
import Gallary from "./Components/Gallary/Gallary";
import Dashboard from "./Pages/Dashboard/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/gallary" replace />} />
          <Route path="gallary" element={<Gallary />} />
          <Route path="dashboard" element={<Dashboard/>} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
