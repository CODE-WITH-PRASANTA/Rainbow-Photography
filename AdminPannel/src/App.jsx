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
import ColdLead from "./Components/ColdLead/ColdLead";
import Enquiry from "./Components/Enquiry/Enquiry";
import Login from "./Components/Login/Login";
import Myprofile from "./Components/Myprofile/Myprofile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Route (No Sidebar/Topbar) */}
        <Route path="/logout" element={<Login />} />

        {/* Protected Layout Routes (With Sidebar & Topbar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/gallary" replace />} />
          <Route path="gallary" element={<Gallary />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="testimonial" element={<Testimonial />} />
          <Route path="team-member" element={<TeamMember />} />
          <Route path="cold-lead" element={<ColdLead />} />
          <Route path="enquiries" element={<Enquiry />} />
          
          {/* Profile Route now renders inside MainLayout */}
          <Route path="profile" element={<Myprofile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;