import React from "react";

const experiences = [
  {
    title: "Frontend Developer",
    company: "Freelance",
    period: "2022 - Present",
    description: "Building modern, responsive websites for clients using React and Tailwind CSS."
  },
  {
    title: "UI/UX Designer",
    company: "Personal Projects",
    period: "2021 - Present",
    description: "Designing user interfaces and experiences for web and mobile applications."
  },
  {
    title: "Student Resource Creator",
    company: "Self-initiated",
    period: "2023 - Present",
    description: "Curating and sharing educational resources for students."
  }
];

const Experience = () => (
  <section id="experience" className="section-card py-16">
    <h2 className="text-2xl font-bold mb-8 text-center">Experience</h2>
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {experiences.map((exp, i) => (
        <div key={i} className="bg-white/10 dark:bg-black/30 rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-primary mb-1">{exp.title}</h3>
          <div className="flex flex-wrap justify-between text-sm text-gray-400 mb-2">
            <span>{exp.company}</span>
            <span>{exp.period}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Experience;
