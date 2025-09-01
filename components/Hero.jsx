import React from "react";

const Hero = () => (
  <section id="hero" className="min-h-screen flex justify-center items-center bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/10">
    <div className="max-w-4xl mx-auto flex flex-row items-center gap-8">
      <img
        src="/images/profile.jpg"
        alt="Hemulen profile"
        className="w-40 h-40 rounded-full border-4 border-fuchsia-400 shadow-lg object-cover fade-in-left"
      />
      <div className="text-center fade-in-right">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gradient bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
          Hemulen
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
          Modern, creative, and professional portfolio. <br />
          <span className="font-semibold">Web Developer | Designer | Student</span>
        </p>
        <a
          href="#contact"
          className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 transition"
        >
          Contact Me
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
