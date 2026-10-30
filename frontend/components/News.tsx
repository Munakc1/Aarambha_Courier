
import Link from "next/link";

type Post = {
  category: string;
  title: string;
  date: string;
  dateLabel: string;
  readTime: string;
  image: string;
  href: string;
};

const posts: Post[] = [
  {
    category: "INDUSTRY NEWS",
    title: "E-commerce Growth in Nepal: Opportunities for Businesses",
    date: "2026-10-29",
    dateLabel: "October 29, 2026",
    readTime: "5 min read",
    image: "/images/1.png",
    href: "/news/ecommerce-growth-in-nepal",
  },
  {
    category: "COURIER TIPS",
    title: "How to Pack Your Parcels Safely for Delivery",
    date: "2026-10-29",
    dateLabel: "October 29, 2026",
    readTime: "6 min read",
    image: "/images/2.jpg",
    href: "/news/how-to-pack-your-parcels",
  },
  {
    category: "BUSINESS INSIGHTS",
    title: "Why Reliable Logistics Is Important for Your Business",
    date: "2026-10-29",
    dateLabel: "October 29, 2026",
    readTime: "6 min read",
    image: "/images/3.jpg",
    href: "/news/why-reliable-logistics-matters",
  },
  {
    category: "TRANSPORT UPDATES",
    title: "Transport Updates in Nepal: What Businesses Should Know",
    date: "2026-10-29",
    dateLabel: "October 29, 2026",
    readTime: "4 min read",
    image: "/images/4.jpg",
    href: "/news/transport-updates-nepal",
  },
];

export default function News() {
  return (
    <section
      id="news"
      aria-labelledby="news-heading"
      className="bg-app px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Blog & Resources
            </p>

            <h2
              id="news-heading"
              className="mt-2 text-xl font-extrabold tracking-tight text-fg sm:text-2xl"
            >
              Latest News & Insights
            </h2>
          </div>

          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-2 border border-primary bg-white-soft px-3 py-2 text-xs font-semibold text-dark-1 transition-colors hover:bg-primary sm:px-4 sm:text-sm dark:bg-transparent dark:text-fg dark:hover:text-dark-1"
          >
            View All News
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* News cards */}
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <li key={post.href}>
              <article className="group h-full overflow-hidden border border-hairline bg-white-soft transition-colors hover:border-primary dark:bg-surface">
                <Link href={post.href} className="block h-full">
                  {/* Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-primary/10 sm:h-48 lg:h-40">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <span className="absolute bottom-0 left-3 bg-primary px-3 py-1 text-[10px] font-bold tracking-wide text-dark-1">
                      {post.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex h-[calc(100%-10rem)] flex-col px-4 pb-4 pt-4">
                    <h3 className="text-sm font-bold leading-6 text-fg transition-colors group-hover:text-primary sm:text-base">
                      {post.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-grey">
                      <time dateTime={post.date}>{post.dateLabel}</time>
                      <span aria-hidden="true">•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-fg">
                      Read Article
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
