import React from "react";

const works = [
  {
    title: "Portfolio Website",
    image: "/images/portfolio.png",
    link: "#",
    description: "A modern, glassy portfolio built with React and Tailwind CSS."
  },
  {
    title: "Student Resource Platform",
    image: "/images/resources.png",
    link: "#",
    description: "A platform for students to access curated PDF resources."
  },
  {
    title: "UI Kit",
    image: "/images/uikit.png",
    link: "#",
    description: "A set of reusable UI components for rapid prototyping."
  }
];

const Works = () => (
  <section id="works" className="section-card py-16">
    <h2 className="text-2xl font-bold mb-8 text-center">Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {works.map((work, i) => (
        <a
          key={i}
          href={work.link}
          className="group bg-white/10 dark:bg-black/30 rounded-xl p-4 shadow-lg flex flex-col items-center text-center hover:scale-105 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-40 object-cover rounded-lg mb-4 border-2 border-fuchsia-400 group-hover:border-cyan-400"
          />
          <h3 className="font-semibold text-lg mb-2 text-primary">{work.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{work.description}</p>
        </a>
      ))}
    </div>
  </section>
);

export default Works;
