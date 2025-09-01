import React, { useEffect, useState } from "react";

const StudentResources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch("/resources/resources.json")
      .then((res) => res.json())
      .then(setResources);
  }, []);

  return (
    <section id="resources" className="section-card py-12">
      <h2 className="text-2xl font-bold mb-6">Student Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {resources.map((res, i) => (
          <div key={i} className="bg-white/10 dark:bg-black/30 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">{res.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{res.description}</p>
            </div>
            <a
              href={`/resources/${res.file}`}
              download
              className="mt-auto inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold transition hover:scale-105 hover:shadow-xl"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentResources;
