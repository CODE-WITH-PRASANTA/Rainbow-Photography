import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";

// ---------- Common Layout ----------
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import GetInTouch from "./Components/GetInTouch/GetInTouch";

// ---------- Pages ----------
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Galary from "./Pages/Galary/Galary";
import Pricing from "./Pages/Pricing/Pricing";
import Contact from "./Pages/Contact/Contact";
import MainFaq from "./Pages/MainFaq/MainFaq";
import FloatingForm from "./Components/FloatingForm/FloatingForm";
import FloatingIcons from "./Components/FloatingIcons/FloatingIcons";

// ---------- Scroll To Top ----------
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

// ---------- Main App ----------
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Navbar */}
      <Navbar />

      {/* Application Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Galary />} />
        <Route path="/package" element={<Pricing />} />
        <Route path="/faq" element={<MainFaq />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Common Footer Sections */}
      <GetInTouch />
      <Footer />
      <FloatingIcons/>
      <FloatingForm/>
    </BrowserRouter>
  );
}

export default App;