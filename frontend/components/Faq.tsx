type Item = { q: string; a: string };

const left: Item[] = [
  {
    q: "How does COD settlement work?",
    a: "We collect the payment from your customer at delivery and transfer the settled amount to your account on the agreed settlement schedule.",
  },
  {
    q: "How can I track my parcel?",
    a: "Enter your tracking number on our website to see real-time status updates from pickup to delivery.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery time depends on the destination. Major cities are usually the fastest, while rural areas may take a little longer.",
  },
];

const right: Item[] = [
  {
    q: "How do I register as a vendor?",
    a: "Create a vendor account, submit your business details, and our team will verify and activate your account.",
  },
  {
    q: "Do you offer pickup service?",
    a: "Yes. We pick up parcels from your home, shop or warehouse and deliver them safely to the destination.",
  },
  {
    q: "Do you deliver outside Nepal?",
    a: "Yes. Our international courier service covers worldwide delivery with customs clearance and global tracking support.",
  },
];

function FaqItem({ q, a }: Item) {
  return (
    <details className="group rounded-lg border border-hairline bg-white-soft shadow-sm dark:bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
        {q}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-200 group-open:rotate-45"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{a}</p>
    </details>
  );
}

export default function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-app px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-primary">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2
            id="faq-heading"
            className="mt-1 text-3xl font-extrabold text-fg sm:text-4xl"
          >
            Have Questions? We’ve Got Answers.
          </h2>
        </div>

        <div className="mt-6 grid items-start gap-3 md:grid-cols-2 md:gap-x-6">
          <div className="space-y-3">
            {left.map((i) => (
              <FaqItem key={i.q} {...i} />
            ))}
          </div>
          <div className="space-y-3">
            {right.map((i) => (
              <FaqItem key={i.q} {...i} />
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <a
            href="/faqs"
            className="inline-flex items-center gap-3 rounded-lg border border-hairline bg-white-soft px-8 py-2.5 text-sm font-semibold uppercase text-fg shadow-sm transition-colors hover:border-primary dark:bg-surface"
          >
            View All FAQs
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
      </div>
    </section>
  );
}