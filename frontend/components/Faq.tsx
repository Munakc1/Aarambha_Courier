
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
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2a900] sm:text-[11px]">
            Frequently Asked Questions
          </p>

          <h2
            id="faq-heading"
            className="mt-1 text-2xl font-extrabold tracking-tight text-[#111111] sm:text-3xl lg:text-[36px]"
          >
            Have Questions? We&apos;ve Got Answers.
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="mt-7 grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-x-7 md:gap-y-2.5">
          {/* Left Column */}
          <div className="space-y-2.5">
            {leftFAQs.map((item) => (
              <details
                key={item.question}
                className="group border border-[#e5e5e5] bg-white transition-all duration-200 hover:border-[#cfcfcf] hover:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-2.5 sm:px-5 sm:py-3 [&::-webkit-details-marker]:hidden">
                  <span className="text-[12px] font-semibold text-[#222] sm:text-[13px]">
                    {item.question}
                  </span>

                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[#222] transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <Plus size={15} strokeWidth={2} />
                  </span>
                </summary>

                <div className="border-t border-[#eeeeee] px-4 py-3 sm:px-5">
                  <p className="text-xs leading-6 text-[#707070] sm:text-sm">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-2.5">
            {rightFAQs.map((item) => (
              <details
                key={item.question}
                className="group border border-[#e5e5e5] bg-white transition-all duration-200 hover:border-[#cfcfcf] hover:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-2.5 sm:px-5 sm:py-3 [&::-webkit-details-marker]:hidden">
                  <span className="text-[12px] font-semibold text-[#222] sm:text-[13px]">
                    {item.question}
                  </span>

                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[#222] transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <Plus size={15} strokeWidth={2} />
                  </span>
                </summary>

                <div className="border-t border-[#eeeeee] px-4 py-3 sm:px-5">
                  <p className="text-xs leading-6 text-[#707070] sm:text-sm">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* View All FAQs */}
        <div className="mt-5 flex justify-center">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2 border border-[#d8d8d8] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#333] transition-all duration-200 hover:border-[#111] hover:bg-[#111] hover:text-white sm:px-5 sm:py-2.5 sm:text-[11px]"
          >
            View All FAQs

            <ArrowRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
