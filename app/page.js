'use client'

import { useState } from "react";
import Link from "next/link";
import Header from "./dashboard/_components/Header";
import { Button } from "@/components/ui/button";

// Simple SVG icons
const LightningBoltIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const UserCheckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a7.5 7.5 0 0113 0" />
    <path d="M16 11l2 2 4-4" />
  </svg>
);

const MessageCircleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-1.9 5.4 8.5 8.5 0 11-6.8-13.9" />
    <path d="M22 2l-10 10" />
  </svg>
);

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbzT_TDNdhe2NMUwk6D0c0Y-hBtC5zlaPgrXEdFN3645wSy-AKOPB8MW-oOsjAIgPxxJ/exec", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (json.status === "success") {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        {/* Hero */}
        <h1 className="text-4xl font-bold max-w-3xl mx-auto">
          Your AI Interview Coach to Ace Every Job
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
          Practice, improve, and get instant AI-powered feedback — all in one place. Double your chances of landing your dream job!
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard" className="inline-block">
            <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-medium text-white">
              Get Started
            </Button>
          </Link>
          <Link href="https://github.com/Lohitha263" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Button className="border border-blue-600 text-blue-600 hover:bg-blue-100 px-6 py-3 text-base font-medium ">
              GitHub Repo
            </Button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center border border-gray-300 rounded-md p-6">
            <LightningBoltIcon className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Generate Questions</h3>
            <p className="text-gray-700 text-center text-sm">
              Paste your job description and get realistic, tailored behavioral and technical questions instantly.
            </p>
          </div>

          <div className="flex flex-col items-center border border-gray-300 rounded-md p-6">
            <UserCheckIcon className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Simulate Interview</h3>
            <p className="text-gray-700 text-center text-sm">
              Practice answering via audio or text, mimicking a real interview environment to build your confidence.
            </p>
          </div>

          <div className="flex flex-col items-center border border-gray-300 rounded-md p-6">
            <MessageCircleIcon className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Get AI Feedback</h3>
            <p className="text-gray-700 text-center text-sm">
              Receive instant AI analysis, ratings, and tips to improve and nail your next interview.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="border border-gray-400 px-4 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="border border-gray-400 px-4 py-2 rounded"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={5}
            className="border border-gray-400 px-4 py-2 rounded resize-none"
          ></textarea>

          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && <p className="text-green-600 mt-2">Message sent successfully!</p>}
          {status === "error" && <p className="text-red-600 mt-2">Oops, something went wrong. Try again.</p>}
        </form>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Ready to take your interview skills to the next level?
        </h2>
        <Link href="/dashboard" className="inline-block">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base font-medium text-white">
            Start Your Mock Interview Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 py-6 text-center text-sm text-gray-500">
        Created by <span className="font-semibold text-blue-600">Lohitha Garapati</span> © 2024 All rights reserved.
      </footer>
    </div>
  );
}
