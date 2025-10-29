"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import ScrollingBanner from "@/components/ScrollingBanner";

const volunteerRoles = [
  "Event Operations",
  "Hospitality & Guest Handling",
  "Media & Content Team",
  "Stage & Technical Crew",
  "Crowd Management",
];

const volunteerPerks = [
  "Certificate of appreciation and LinkedIn recommendation.",
  "Exclusive crew tees and behind-the-scenes access.",
  "Hands-on mentorship from the core production team.",
  "Networking with artists, creators, and sponsors.",
];

const formFieldClasses =
  "w-full bg-white px-4 py-3 text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:ring-offset-2 focus:ring-offset-black placeholder:text-black/50";
const formLabelClasses =
  "flex flex-col gap-2 text-sm font-montserrat font-medium text-white";

export default function VolunteerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);

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
      termsAccepted: formData.get("terms") === "accepted",
      timestamp: new Date().toLocaleString("en-IN"),
    };

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        form.reset();

        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setSubmitStatus("error");
        setError(result.message || "An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus("error");
      setError("There was an error submitting the form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 bg-[#ffe300] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 bg-[#ff1a1a] opacity-40 blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
          <span className="font-montserrat text-xs uppercase tracking-[0.6em] text-[#ffe300]">Involve With Us</span>
          <h1 className="font-travel-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-white">
            Join the Madness Crew
          </h1>
          <p className="max-w-3xl text-base sm:text-lg md:text-xl text-white/80">
            Be part of the team that makes Madooza happen. Volunteers get certificates, free passes, and behind-the-scenes access.
            Ideal for students looking for real event experience.
          </p>
        </div>
      </section>

      <section className="border-y border-[#ffe300]/30 bg-black py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div className="flex flex-col gap-6 bg-[#ff1a1a] p-8 text-white shadow-[0_0_35px_rgba(255,26,26,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Volunteer Roles</h2>
            <ul className="space-y-3 text-sm sm:text-base text-white/80">
              {volunteerRoles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
            <p className="bg-black px-4 py-3 text-sm text-white">
              Shortlisted volunteers will be contacted for briefing sessions.
            </p>
          </div>
          <div className="flex flex-col gap-6 bg-[#ffe300] p-8 text-black shadow-[0_0_35px_rgba(255,227,0,0.25)]">
            <h2 className="font-travel-sans text-2xl sm:text-3xl uppercase">Why Volunteer?</h2>
            <ul className="space-y-3 text-sm sm:text-base">
              {volunteerPerks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <p className="bg-black px-4 py-3 text-sm text-white">
              Orientation will cover duties, check-in schedules, and crew protocols.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ffe300]/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-travel-sans text-3xl uppercase text-[#ffe300]">Ready to Suit Up?</h2>
          <p className="mt-4 text-sm sm:text-base text-white/80">
            Fill in your details and choose your preferred role. We&apos;ll get in touch with next steps.
          </p>
        </div>
      </section>

      <section className="bg-black py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 bg-[#00f5ff]/50 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-none bg-black p-8 text-white shadow-[0_0_45px_rgba(0,255,255,0.35)]">
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <label className={formLabelClasses}>
                Full Name
                <input id="volunteer-name" name="name" type="text" required className={formFieldClasses} placeholder="Enter your full name" />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={formLabelClasses}>
                  Age
                  <input id="volunteer-age" name="age" type="number" min="15" required className={formFieldClasses} placeholder="18" />
                </label>
                <label className={formLabelClasses}>
                  Institution / Organization
                  <input id="volunteer-institution" name="institution" type="text" required className={formFieldClasses} placeholder="College or organization name" />
                </label>
              </div>
              <label className={formLabelClasses}>
                Preferred Role
                <select id="volunteer-role" name="role" required defaultValue="" className={`${formFieldClasses} cursor-pointer`}>
                  <option value="" disabled className="bg-white text-black">
                    Select a role
                  </option>
                  {volunteerRoles.map((role) => (
                    <option key={role} value={role.toLowerCase()} className="bg-white text-black">
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={formLabelClasses}>
                  Phone Number
                  <input id="volunteer-phone" name="phone" type="tel" required className={formFieldClasses} placeholder="+91 XXXXXXXXXX" />
                </label>
                <label className={formLabelClasses}>
                  Email ID
                  <input id="volunteer-email" name="email" type="email" required className={formFieldClasses} placeholder="your.email@example.com" />
                </label>
              </div>
              <label className={formLabelClasses}>
                Anything we should know?
                <textarea id="volunteer-note" name="note" rows={3} className={`${formFieldClasses} resize-none`} placeholder="Availability, past experience, or special skills" />
              </label>
              <label className="flex items-start gap-3 text-sm font-montserrat text-white/80">
                <input type="checkbox" name="terms" value="accepted" required className="mt-1 h-5 w-5 accent-[#ff1a1a]" />
                <span className="text-left">
                  I accept the{" "}
                  <Link href="/terms-and-conditions" className="text-[#00f5ff] underline-offset-4 hover:underline">
                    terms and conditions
                  </Link>
                </span>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff1a1a] px-6 py-3 text-base font-montserrat font-semibold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Apply to Volunteer"}
              </button>
              {submitStatus === "success" && (
                <p className="bg-[#00f5ff]/20 px-4 py-3 text-center text-sm text-white">
                  Thanks for joining the crew! We&apos;ll reach out with briefing details shortly. Redirecting...
                </p>
              )}
              {submitStatus === "error" && (
                <p className="bg-[#ff1a1a]/40 px-4 py-3 text-center text-sm text-white">{error}</p>
              )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <ScrollingBanner />
      <ContactUs />
      <Footer />
    </div>
  );
}
