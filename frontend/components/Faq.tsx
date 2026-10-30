
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: "How does COD settlement work?",
    answer:
      "After successful delivery and collection, COD amounts are settled with the vendor according to the agreed settlement schedule and operational process.",
  },
  {
    question: "How can I track my parcel?",
    answer:
      "Enter your Aarambha tracking number on the Track Shipment page to check the available status and tracking information for your parcel.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on the pickup location, destination, service type, route, and operational conditions. Contact Aarambha for an estimated delivery timeline.",
  },
  {
    question: "How do I register as a vendor?",
    answer:
      "Online sellers and businesses can contact Aarambha to discuss vendor registration, parcel pickup, COD, delivery handling, and other courier requirements.",
  },
  {
    question: "Do you offer pickup service?",
    answer:
      "Yes. Aarambha provides pickup support for eligible vendors and customers. Pickup availability depends on the location, route, and service requirements.",
  },
  {
    question: "Do you deliver outside Nepal?",
    answer:
      "Aarambha provides international courier inquiry support. Availability, pricing, documentation, and delivery options depend on the destination and shipment requirements.",
  },
];

export default function HomeFAQ() {
  const leftFAQs = faqItems.slice(0, 3);
  const rightFAQs = faqItems.slice(3, 6);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      {/* SEO FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[#fafafa] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FAA212] sm:text-[11px]">
            Frequently Asked Questions
          </p>

          <h2
            id="faq-heading"
            className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A0E12] sm:text-3xl lg:text-[36px]"
          >
            Have Questions? We&apos;ve Got Answers.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#666a70] sm:text-base">
            Find answers to common questions about deliveries, tracking,
            vendor registration, and COD services.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-6 md:gap-y-3">
          {/* Left Column */}
          <div className="space-y-3">
            {leftFAQs.map((item) => (
              <details
                key={item.question}
                className="group border border-[#e5e5e5] bg-white transition-colors duration-200 hover:border-[#FBB501] open:border-[#FBB501]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-semibold leading-5 text-[#222222] sm:text-sm">
                    {item.question}
                  </span>

                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[#0A0E12] transition-transform duration-200 group-open:rotate-45"
                  >
                    <Plus size={16} strokeWidth={2} />
                  </span>
                </summary>

                <div className="border-t border-[#eeeeee] px-4 py-3 sm:px-5">
                  <p className="text-xs leading-6 text-[#666a70] sm:text-sm">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {rightFAQs.map((item) => (
              <details
                key={item.question}
                className="group border border-[#e5e5e5] bg-white transition-colors duration-200 hover:border-[#FBB501] open:border-[#FBB501]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-semibold leading-5 text-[#222222] sm:text-sm">
                    {item.question}
                  </span>

                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[#0A0E12] transition-transform duration-200 group-open:rotate-45"
                  >
                    <Plus size={16} strokeWidth={2} />
                  </span>
                </summary>

                <div className="border-t border-[#eeeeee] px-4 py-3 sm:px-5">
                  <p className="text-xs leading-6 text-[#666a70] sm:text-sm">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* View All FAQs */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2 border border-[#d8d8d8] bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#0A0E12] transition-colors duration-200 hover:border-[#0A0E12] hover:bg-[#0A0E12] hover:text-white"
          >
            View All FAQs
            <ArrowRight
              size={14}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
