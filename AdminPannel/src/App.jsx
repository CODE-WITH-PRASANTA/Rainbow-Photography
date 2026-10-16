
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
import Testimonial from "./Components/Testimonial/Testimonial";
import TeamMember from "./Components/TeamMember/TeamMember";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/gallary" replace />} />
          <Route path="gallary" element={<Gallary />} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="testimonial" element={<Testimonial/>} />
          <Route path="team-member" element={<TeamMember/>} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
