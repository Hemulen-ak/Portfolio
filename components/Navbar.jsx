import React, { useState } from "react";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Services", href: "#services" },
  { name: "Works", href: "#works" },
  { name: "Resources", href: "#resources" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="#hero" className="font-extrabold text-xl text-gradient bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">Hemulen</a>
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul className={`md:flex gap-8 font-medium hidden md:static md:bg-transparent md:p-0 ${open ? 'block absolute top-full left-0 w-full bg-white dark:bg-black p-4' : 'hidden'}`}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-fuchsia-500 transition-colors block py-2 md:py-0">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
