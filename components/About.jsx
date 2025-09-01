import React from "react";

const About = () => (
  <section id="about" className="section-card py-16">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">About Me</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Hi! I'm Hemulen, a passionate web developer and designer. I love building modern, beautiful, and functional websites. My interests include frontend development, UI/UX design, and creating resources for students.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <span className="px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200 font-semibold">React</span>
        <span className="px-4 py-2 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-700 dark:text-fuchsia-200 font-semibold">Tailwind CSS</span>
        <span className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-semibold">UI/UX</span>
        <span className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 font-semibold">Student Resources</span>
      </div>
    </div>
  </section>
);

export default About;
