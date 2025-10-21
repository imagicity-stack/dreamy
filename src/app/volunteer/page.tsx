"use client";

import { FormEvent, useState } from "react";
import {useRouter} from "next/navigation"
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

export default function VolunteerPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    setLoading(true);
    setError("");
    setSubmitStatus(null);

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      age: formData.get("age"),
      institution: formData.get("institution"),
      role: formData.get("role"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      note: formData.get("note"),
      timestamp: new Date().toLocaleString("en-IN"),
    };

    try {
      // Assumes your API endpoint for volunteers is /api/volunteers
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Form submission result:", result);

      if (result.success) {
        setSubmitStatus('success');
        setSubmitted(true);
        form.reset();
        
        // Optional: Redirect after a few seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);

      } else {
        setSubmitStatus('error');
        setError(result.message || "An unexpected error occurred. Please try again.");
      }

    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus('error');
      setError("There was an error submitting the form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7300ff] via-[#ff1a00] to-[#ffe300] py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.4em] text-[#ffe300] font-oswald mb-4">
            Involve With Us
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald uppercase text-white drop-shadow-xl">
            Join the Madness Crew
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed">
            Be part of the team that makes Madooza happen. Volunteers get certificates, free passes, and behind-the-scenes
            access. Ideal for students looking for real event experience.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
          <div className="bg-[#11011b] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Volunteer Roles
            </h2>
            <ul className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
              <li>Event Operations</li>
              <li>Hospitality &amp; Guest Handling</li>
              <li>Media &amp; Content Team</li>
              <li>Stage &amp; Technical Crew</li>
              <li>Crowd Management</li>
            </ul>
            <div className="mt-8 p-4 sm:p-5 bg-[#ffe300]/10 border border-[#ffe300]/40 rounded-xl text-[#ffe300] text-sm sm:text-base">
              <p>Shortlisted volunteers will be contacted for briefing sessions.</p>
            </div>
          </div>

          <div className="bg-[#1a062a] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-oswald text-[#ffe300] uppercase mb-6">
              Apply to Volunteer
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="volunteer-name">
                  Full Name
                </label>
                <input
                  id="volunteer-name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="volunteer-age">
                    Age
                  </label>
                  <input
                    id="volunteer-age"
                    name="age"
                    type="number"
                    min="15"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="volunteer-institution">
                    Institution / Organization
                  </label>
                  <input
                    id="volunteer-institution"
                    name="institution"
                    type="text"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="College or organization name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="volunteer-role">
                  Preferred Role
                </label>
                <select
                  id="volunteer-role"
                  name="role"
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose a role
                  </option>
                  <option value="operations">Event Operations</option>
                  <option value="hospitality">Hospitality &amp; Guest Handling</option>
                  <option value="media">Media &amp; Content Team</option>
                  <option value="stage">Stage &amp; Technical Crew</option>
                  <option value="crowd">Crowd Management</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="volunteer-phone">
                    Contact Number
                  </label>
                  <input
                    id="volunteer-phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="volunteer-email">
                    Email ID
                  </label>
                  <input
                    id="volunteer-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2" htmlFor="volunteer-note">
                  Why do you want to join Madooza?
                </label>
                <textarea
                  id="volunteer-note"
                  name="note"
                  rows={4}
                  required
                  className="w-full rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm sm:text-base focus:border-[#ffe300] focus:outline-none"
                  placeholder="Share a short note"
                />
              </div>

             <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#ffe300] px-4 py-3 font-oswald text-lg text-black uppercase tracking-wide hover:bg-[#ffd000] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Apply Now"}
              </button>

             {submitStatus === 'success' && (
                <p className="rounded-md bg-green-500/10 border border-green-400/40 text-green-200 px-4 py-3 text-sm sm:text-base">
                  Thanks for signing up! We&apos;ll reach out with the next steps and briefing schedule.
                </p>
              )}

              {submitStatus === 'error' && (
                <p className="rounded-md bg-red-500/10 border border-red-400/40 text-red-200 px-4 py-3 text-sm sm:text-base">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
