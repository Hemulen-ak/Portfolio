import React from "react";

const Footer = () => (
  <footer className="py-6 text-center text-gray-500 dark:text-gray-400 bg-white/10 dark:bg-black/30 border-t border-gray-200 dark:border-gray-800">
    <span>
      &copy; {new Date().getFullYear()} Hemulen. All rights reserved.
    </span>
  </footer>
);

export default Footer;
