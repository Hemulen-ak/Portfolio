import React from "react";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Services from "./components/Services";
import Works from "./components/Works";
import StudentResources from "./components/StudentResources";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const App = () => (
  <div className="bg-gradient-to-br from-cyan-100 via-fuchsia-100 to-white dark:from-gray-900 dark:via-black dark:to-gray-800 min-h-screen text-gray-900 dark:text-white">
    <Navbar />
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
    <main className="pt-20">
      <Hero />
      <About />
      <Experience />
      <Services />
      <Works />
      <StudentResources />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default App;
