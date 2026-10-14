
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Topbar from "./Components/Topbar/Topbar";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

const App = () => {
  return (
   <Router>
      <Topbar />
      <Navbar />

    <Routes>
       <Route path="/" element={<div>Home Page</div>} />
   </Routes>

     <Footer />
</Router>
  );
};

export default App;
