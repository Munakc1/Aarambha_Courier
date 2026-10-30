"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Search,
} from "lucide-react";
import {
  blogArticles,
  BlogCategory,
} from "@/lib/blog-data";

const categories: Array<"All" | BlogCategory> = [
  "All",
  "Courier Tips",
  "E-commerce Logistics",
  "COD Guidance",
  "Packaging Tips",
  "Delivery Updates",
  "Aarambha News",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] =
    useState<"All" | BlogCategory>("All");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return blogArticles.filter((article) => {
      const categoryMatch =
        activeCategory === "All" ||
        article.category === activeCategory;

      const searchMatch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className="bg-app">
      {/* HERO */}
      <section className="bg-dark-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Blog / Resources
            </p>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Courier &amp; E-commerce
              <span className="block text-primary">
                Logistics Resources
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              Practical information for online sellers, businesses, vendors,
              and everyday parcel senders.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${
                    activeCategory === category
                      ? "bg-primary text-dark-1"
                      : "border border-hairline bg-panel text-muted hover:border-primary/40 hover:text-fg"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search resources..."
                className="w-full rounded-xl border border-hairline bg-panel py-3 pl-10 pr-4 text-sm text-fg outline-none placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="bg-app py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted">
                {filteredArticles.length}{" "}
                {filteredArticles.length === 1
                  ? "resource"
                  : "resources"}
              </p>

              <h2 className="mt-1 text-2xl font-black text-fg sm:text-3xl">
                Latest Resources
              </h2>
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group overflow-hidden rounded-3xl border border-hairline bg-panel transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/blog/${article.slug}`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-dark-2">
                      <img
                        src={article.image}
                        alt={article.imageAlt}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-4 top-4 rounded-full bg-dark-1/85 px-3 py-1.5 text-[11px] font-bold text-primary backdrop-blur">
                        {article.category}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-3 text-xs text-faint">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(article.date)}
                        </span>

                        <span>•</span>

                        <span>{article.readTime}</span>
                      </div>

                      <h3 className="mt-4 text-xl font-black leading-snug text-fg transition group-hover:text-primary">
                        {article.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                        {article.excerpt}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-fg">
                        Read article
                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-hairline bg-panel px-6 py-14 text-center">
              <Search className="mx-auto h-8 w-8 text-faint" />

              <h3 className="mt-4 text-xl font-black text-fg">
                No resources found
              </h3>

              <p className="mt-2 text-sm text-muted">
                Try another search term or choose a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-1 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Need Help?
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Need Courier Support?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/50">
            Have a courier, pickup, COD, or shipment inquiry? Talk directly
            with Aarambha Courier.
          </p>

          <a
            href="https://wa.me/9779801255799"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
          >
            Talk to Aarambha on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}