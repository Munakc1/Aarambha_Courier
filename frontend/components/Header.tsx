"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Bike, ImagePlus, PackageSearch, Send } from "lucide-react";

/**
 * Put your hero photo (rider + van) at:  app/public/images/hero.png
 * Until the file exists, a dashed placeholder keeps the space reserved.
 */
const HERO_IMAGE = "/images/hero.png";

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative bg-white">
      {/* ───────────── Hero banner ───────────── */}
      <div className="relative overflow-hidden rounded-b-[40px] bg-cream lg:min-h-125 lg:rounded-bl-[56px]">
        {/* Photo slot — below the text on mobile, full right side on desktop */}
        <HeroImage />

        {/* Dotted route + map pin (desktop only, decorative) */}
        <svg
          aria-hidden="true"
          viewBox="305 18 400 112"
          className="pointer-events-none absolute left-[22.5%] top-2 z-1 hidden w-[30%] lg:block"
          fill="none"
        >
          <path
            d="M313 38 C 362 26, 412 38, 446 58"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.5 6"
          />
          <path
            d="M480 52 C 566 40, 646 78, 700 124"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.5 6"
          />
          <ellipse cx="460" cy="68" rx="11" ry="3" fill="var(--primary)" opacity="0.35" />
          <path
            d="M460 66 C 460 66 444 52 444 41 a16 16 0 1 1 32 0 C 476 52 460 66 460 66 Z"
            fill="var(--primary)"
          />
          <circle cx="460" cy="41" r="6" fill="#fff" />
        </svg>

        {/* Copy */}
        <div className="relative z-10 mx-auto flex w-full max-w-360 flex-col px-5 pb-6 pt-12 sm:px-8 lg:min-h-125 lg:justify-center lg:pb-24 lg:pt-14 xl:px-10 2xl:px-18">
          <div className="max-w-xl">
            <p className="inline-block rounded-[3px] bg-primary px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-dark-1 sm:text-[13px]">
              Fast. Secure. Reliable.
            </p>

            {/* line-height / tracking set inline: global.css styles bare h1 elements */}
            <h1
              id="hero-title"
              className="mt-3 font-extrabold uppercase text-dark-1 text-[clamp(2.6rem,4.7vw,4.25rem)]"
              style={{ lineHeight: 0.98, letterSpacing: "-0.01em" }}
            >
              We deliver
              <span className="block text-primary">Trust</span>
            </h1>

            <p className="mt-4 max-w-sm text-[16px] leading-7 text-dark-1/85 sm:text-[17px]">
              Aarambha Courier delivers your parcels safely and on time across Nepal.
            </p>

            <Link
              href="/book-pickup"
              className="group mt-7 inline-flex h-12 items-center gap-3 rounded-md bg-primary px-5 text-[14px] font-bold uppercase tracking-wide text-dark-1 shadow-[0_10px_24px_-12px_rgba(251,181,1,0.9)] transition-colors hover:bg-primary-light"
            >
              <Bike size={22} strokeWidth={1.7} aria-hidden="true" />
              Book a Pickup
              <ArrowRight
                size={17}
                strokeWidth={2.2}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ───────────── Tracking card (overlaps the banner) ───────────── */}
      <div className="relative z-20 mx-auto -mt-8 w-[calc(100%-2.5rem)] max-w-290 sm:w-[calc(100%-4rem)] lg:-mt-12 lg:w-[86%]">
        <TrackCard />
      </div>
    </section>
  );
}

/* ───────────────────────── hero photo ───────────────────────── */

function HeroImage() {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // catch images that already failed before hydration
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="relative mt-8 aspect-4/3 w-full sm:aspect-16/10 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:w-[67%]">
      {failed ? (
        <div className="absolute inset-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/70 bg-white/50 text-center text-[13px] text-dark-1/70 lg:inset-8 lg:left-24">
          <ImagePlus size={28} aria-hidden="true" className="text-primary" />
          <span className="font-semibold">Hero image goes here</span>
          <span>
            Add <code className="rounded bg-dark-1/5 px-1.5 py-0.5">public/images/hero.png</code>
          </span>
        </div>
      ) : (
        <Image
          ref={ref}
          src={HERO_IMAGE}
          alt="Aarambha Courier rider and delivery van in front of a Kathmandu stupa"
          fill
          priority
          sizes="(min-width: 1024px) 67vw, 100vw"
          onError={() => setFailed(true)}
          className="object-cover object-[60%_center]"
        />
      )}

      {/* fade photo into the cream banner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background: "linear-gradient(to bottom, var(--cream) 0%, rgb(254 248 235 / 0) 28%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, var(--cream) 0%, rgb(254 248 235 / 0.85) 12%, rgb(254 248 235 / 0) 42%)",
        }}
      />
    </div>
  );
}

/* ───────────────────────── tracking card ───────────────────────── */

function TrackCard() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = value.trim();
    if (!id) {
      setError("Please enter your tracking number.");
      return;
    }
    setError("");
    router.push(`/track?number=${encodeURIComponent(id)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      role="search"
      aria-label="Track your shipment"
      className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_22px_50px_-22px_rgba(10,14,18,0.28)] sm:px-7 lg:flex lg:items-center lg:gap-7 lg:py-5"
    >
      {/* icon + copy */}
      <div className="flex items-center gap-4 lg:w-85 lg:shrink-0">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/45 text-dark-1">
          <PackageSearch size={30} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <div>
          <h2
            className="text-[17px] font-extrabold uppercase text-dark-1 sm:text-[18px]"
            style={{ letterSpacing: "0.01em", lineHeight: 1.2 }}
          >
            Track your shipment
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-dark-1/70">
            Enter your tracking number to get real-time updates on your parcel.
          </p>
        </div>
      </div>

      {/* input */}
      <div className="mt-4 flex-1 lg:mt-0">
        <label htmlFor="tracking-number" className="sr-only">
          Tracking number
        </label>
        <input
          id="tracking-number"
          name="number"
          type="text"
          inputMode="text"
          autoComplete="off"
          placeholder="Enter Tracking Number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={!!error}
          aria-describedby="tracking-error"
          className={`h-13.5 w-full rounded-md border bg-white px-4 text-[15px] text-dark-1 outline-none transition-colors placeholder:text-text-grey focus-visible:border-primary ${
            error ? "border-red-400" : "border-[#d9dde3]"
          }`}
        />
        <p id="tracking-error" role="alert" className="mt-1.5 min-h-0 text-[12px] text-red-500">
          {error}
        </p>
      </div>

      {/* submit */}
      <button
        type="submit"
        className="mt-3 inline-flex h-13.5 w-full items-center justify-center gap-2.5 rounded-md bg-primary text-[15px] font-bold uppercase tracking-wide text-dark-1 transition-colors hover:bg-primary-light lg:mt-0 lg:w-55 lg:shrink-0 lg:self-start"
      >
        <Send size={19} strokeWidth={1.8} aria-hidden="true" />
        Track Now
      </button>
    </form>
  );
}