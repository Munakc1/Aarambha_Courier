type Post = {
  category: string;
  title: string;
  date: string; // ISO
  dateLabel: string;
  readTime: string;
  image: string;
  href: string;
};

const posts: Post[] = [
  {
    category: "INDUSTRY NEWS",
    title: "E-commerce Growth in Nepal: Opportunities for 2024",
    date: "2024-05-10",
    dateLabel: "May 10, 2024",
    readTime: "5 min read",
    image: "/news/ecommerce-growth.jpg",
    href: "/news/ecommerce-growth-in-nepal",
  },
  {
    category: "COURIER TIPS",
    title: "How to Pack Your Parcels Safely for Delivery",
    date: "2024-05-08",
    dateLabel: "May 8, 2024",
    readTime: "6 min read",
    image: "/news/pack-parcels.jpg",
    href: "/news/how-to-pack-your-parcels",
  },
  {
    category: "BUSINESS INSIGHTS",
    title: "Why Reliable Logistics is Important for Your Business",
    date: "2024-05-05",
    dateLabel: "May 5, 2024",
    readTime: "6 min read",
    image: "/news/reliable-logistics.jpg",
    href: "/news/why-reliable-logistics-matters",
  },
  {
    category: "TRANSPORT UPDATES",
    title: "New Transport Regulations in Nepal – What You Need to Know",
    date: "2024-05-03",
    dateLabel: "May 3, 2024",
    readTime: "4 min read",
    image: "/news/transport-regulations.jpg",
    href: "/news/new-transport-regulations-nepal",
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
        <div className="flex items-center justify-between gap-4">
          <h2
            id="news-heading"
            className="text-sm font-semibold tracking-wide text-primary sm:text-base"
          >
            LATEST NEWS &amp; INSIGHTS
          </h2>
          <a
            href="/news"
            className="inline-flex items-center gap-2 rounded-lg border border-primary bg-white-soft px-4 py-2 text-sm font-semibold text-dark-1 transition-colors hover:bg-primary dark:bg-transparent dark:text-fg dark:hover:text-dark-1"
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
          </a>
        </div>

        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p) => (
            <li key={p.href}>
              <article className="group h-full overflow-hidden rounded-xl border border-hairline bg-white-soft shadow-sm transition-shadow hover:shadow-md dark:bg-surface">
                <a href={p.href} className="block">
                  <div className="relative h-36 w-full overflow-hidden bg-primary/20 sm:h-40 lg:h-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-0 left-3 rounded-t-md bg-primary px-3 py-1 text-[11px] font-bold tracking-wide text-dark-1">
                      {p.category}
                    </span>
                  </div>

                  <div className="px-4 pb-4 pt-3">
                    <h3 className="text-base font-bold leading-snug text-fg">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-xs text-text-grey">
                      <time dateTime={p.date}>{p.dateLabel}</time>
                      <span aria-hidden="true">•</span>
                      <span>{p.readTime}</span>
                    </p>
                  </div>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}