import React from "react";

const services = [
  {
    icon: "💻",
    title: "Web Development",
    description: "Modern, responsive websites using React, Tailwind CSS, and best practices."
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    description: "Beautiful, user-friendly interfaces and experiences."
  },
  {
    icon: "📚",
    title: "Student Resources",
    description: "Curated PDF resources and guides for students."
  }
];

const Services = () => (
  <section id="services" className="section-card py-16">
    <h2 className="text-2xl font-bold mb-8 text-center">Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {services.map((service, i) => (
        <div key={i} className="bg-white/10 dark:bg-black/30 rounded-xl p-8 shadow-lg flex flex-col items-center text-center">
          <div className="text-4xl mb-4">{service.icon}</div>
          <h3 className="font-semibold text-lg mb-2 text-primary">{service.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Services;
