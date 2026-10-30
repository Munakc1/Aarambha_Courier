import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

import {
  blogArticles,
  getArticleBySlug,
} from "@/lib/blog-data";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.aarambhacourier.com";

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | Aarambha Courier",
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${article.slug}`;

  return {
    title: `${article.title} | Aarambha Courier`,
    description: article.excerpt,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      images: [
        {
          url: `${SITE_URL}${article.image}`,
          alt: article.imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [`${SITE_URL}${article.image}`],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = blogArticles
    .filter(
      (item) =>
        item.slug !== article.slug &&
        item.category === article.category
    )
    .slice(0, 3);

  const fallbackRelated =
    relatedArticles.length > 0
      ? relatedArticles
      : blogArticles
          .filter((item) => item.slug !== article.slug)
          .slice(0, 3);

  const canonicalUrl = `${SITE_URL}/blog/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [`${SITE_URL}${article.image}`],
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Aarambha Courier",
      url: SITE_URL,
    },
  };

  return (
    <main className="bg-app">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* BREADCRUMB */}
      <section className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-muted"
          >
            <Link
              href="/"
              className="transition hover:text-primary"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/blog"
              className="transition hover:text-primary"
            >
              Blog
            </Link>

            <span>/</span>

            <span className="line-clamp-1 text-faint">
              {article.title}
            </span>
          </nav>
        </div>
      </section>

      {/* ARTICLE HEADER */}
      <section className="bg-dark-1 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>

          <div className="mt-8">
            <span className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-black text-dark-1">
              {article.category}
            </span>

            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-white/60 sm:text-lg">
              {article.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-white/40">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatDate(article.date)}
              </span>

              <span>•</span>

              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED IMAGE */}
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-0 overflow-hidden rounded-3xl border border-hairline bg-dark-2 shadow-xl lg:-mt-10">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="aspect-[16/8] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="bg-surface py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
          <article className="min-w-0">
            <div className="prose prose-lg max-w-none">
              {article.content.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={index}
                      className="mb-4 mt-10 text-2xl font-black tracking-tight text-fg first:mt-0 sm:text-3xl"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "list") {
                  return (
                    <ul
                      key={index}
                      className="my-6 space-y-3 pl-5 text-base leading-8 text-muted"
                    >
                      {block.items?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={index}
                    className="mb-6 text-base leading-8 text-muted sm:text-lg"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 border-t border-hairline pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold text-fg transition hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all resources
              </Link>
            </div>
          </article>

          {/* SIDEBAR CTA */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-dark-1 p-6 sm:p-7">
              <MessageCircle className="h-7 w-7 text-primary" />

              <h2 className="mt-5 text-xl font-black text-white">
                Need Courier Support?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Have a question about pickup, delivery, COD, or another
                courier requirement?
              </p>

              <a
                href="https://wa.me/9779801255799"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
              >
                Talk to Aarambha on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-cream py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-grey">
              Keep Reading
            </p>

            <h2 className="mt-2 text-2xl font-black text-fg sm:text-3xl">
              Related Resources
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {fallbackRelated.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group overflow-hidden rounded-2xl border border-hairline bg-white-soft transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[16/9] overflow-hidden bg-dark-2">
                  <img
                    src={related.image}
                    alt={related.imageAlt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-grey">
                    {related.category}
                  </span>

                  <h3 className="mt-2 font-black leading-snug text-fg transition group-hover:text-primary">
                    {related.title}
                  </h3>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-fg">
                    Read article
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-dark-1 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Aarambha Courier
          </p>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Need Courier Support?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/50">
            Talk directly with Aarambha about your courier, pickup, delivery,
            or shipment requirement.
          </p>

          <a
            href="https://wa.me/9779801255799"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
          >
            <MessageCircle className="h-4 w-4" />
            Talk to Aarambha on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}