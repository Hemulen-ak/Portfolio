import React from "react";

const Contact = () => (
  <section id="contact" className="section-card py-16">
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Want to work together or have a question? Reach out!
      </p>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="px-4 py-3 rounded-lg bg-white/20 dark:bg-black/30 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="px-4 py-3 rounded-lg bg-white/20 dark:bg-black/30 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          required
        />
        <textarea
          placeholder="Your Message"
          rows={4}
          className="px-4 py-3 rounded-lg bg-white/20 dark:bg-black/30 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  </section>
);

export default Contact;
