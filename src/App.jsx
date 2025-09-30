import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import NewProject from "./pages/NewProject";
import Projects from "./pages/account/Projects";
import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Settings from "./pages/account/Settings";
import Messages from "./pages/account/Messages";
import MyProjects from "./pages/account/MyProjects";
import FreelancerLayout from "./pages/freelancer/FreelancerLayout";
import Intro from "./pages/freelancer/Intro";
import Services from "./pages/freelancer/Services";
import Portfolio from "./pages/freelancer/Portfolio";
import Reviews from "./pages/freelancer/Reviews";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DbTest from "./pages/DbTest";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/db-test" element={<DbTest />} />

          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/post-project" element={<NewProject />} />

          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-projects" element={<MyProjects />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/freelancer" element={<FreelancerLayout />}>
            <Route index element={<Navigate to="intro" replace />} />
            <Route path="intro" element={<Intro />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>
          <Route
            path="*"
            element={<div className="container-ld py-24">404</div>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
