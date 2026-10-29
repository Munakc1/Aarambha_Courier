
"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type AboutData = {
  title?: string;
  name?: string;
  description?: string;
  mission?: string;
  vision?: string;
  address?: string;
  phone?: string | string[];
  email?: string;
  services?: string[];
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAbout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/about`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
      }

      const result = await response.json();

      // Supports both { success: true, data: {...} }
      // and a direct JSON object response.
      const data = result.data ?? result.about ?? result;

      if (!data || typeof data !== "object") {
        throw new Error("Invalid About API response.");
      }

      setAbout(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load About information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchAbout();
  }, []);

  return (
    <main className="min-h-screen bg-[#FEF8EB] text-[#0A0E12]">
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBB501]">
            <Building2 className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider">
              About Aarambha
            </p>
            <h1 className="text-3xl font-bold sm:text-5xl">
              {about?.title || about?.name || "About Us"}
            </h1>
          </div>
        </div>

        {loading && (
          <p className="py-10 text-gray-600">
            Loading About information...
          </p>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-white p-6">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => void fetchAbout()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FBB501] px-4 py-2 font-semibold"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && about && (
          <div className="space-y-8">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
              <h2 className="mb-4 text-2xl font-bold">
                Who We Are
              </h2>

              <p className="whitespace-pre-line leading-8 text-gray-600">
                {about.description ||
                  "Welcome to Aarambha Courier and Transport Service Pvt. Ltd."}
              </p>
            </section>

            {(about.mission || about.vision) && (
              <div className="grid gap-6 md:grid-cols-2">
                {about.mission && (
                  <section className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-3 text-xl font-bold">
                      Our Mission
                    </h2>
                    <p className="leading-7 text-gray-600">
                      {about.mission}
                    </p>
                  </section>
                )}

                {about.vision && (
                  <section className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-3 text-xl font-bold">
                      Our Vision
                    </h2>
                    <p className="leading-7 text-gray-600">
                      {about.vision}
                    </p>
                  </section>
                )}
              </div>
            )}

            {about.services && about.services.length > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <h2 className="mb-5 text-2xl font-bold">
                  Our Services
                </h2>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {about.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-lg bg-[#FEF8EB] p-4 font-medium"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl bg-[#141B22] p-6 text-white sm:p-8">
              <h2 className="mb-5 text-2xl font-bold">
                Contact Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-3">
                {about.address && (
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 shrink-0 text-[#FBB501]" />
                    <p>{about.address}</p>
                  </div>
                )}

                {about.phone && (
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-[#FBB501]" />
                    <p>
                      {Array.isArray(about.phone)
                        ? about.phone.join(" / ")
                        : about.phone}
                    </p>
                  </div>
                )}

                {about.email && (
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-[#FBB501]" />
                    <a
                      href={`mailto:${about.email}`}
                      className="break-all hover:text-[#FBB501]"
                    >
                      {about.email}
                    </a>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
