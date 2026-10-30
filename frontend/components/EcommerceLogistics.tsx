import {
  Banknote,
  MessageCircle,
  PackageCheck,
  PackageSearch,
  Truck,
  ArrowRight,
} from "lucide-react";
import { whatsappUrl } from "@/lib/company"; // adjust path

const WHATSAPP_URL = whatsappUrl(
  "Hello Aarambha Courier, I sell online and would like to talk about delivery and cash on delivery for my orders."
);

const features = [
  {
    icon: PackageCheck,
    title: "Pickup from your location",
    text: "We collect packed orders from your shop or home.",
  },
  {
    icon: Truck,
    title: "Delivery across Nepal",
    text: "Orders reach customers in cities, towns and rural areas.",
  },
  {
    icon: Banknote,
    title: "Cash on delivery",
    text: "We collect payment from your customer at the door.",
  },
  {
    icon: PackageSearch,
    title: "Order tracking",
    text: "Every parcel gets a tracking number you can check online.",
  },
];

export default function EcommerceLogistics() {
  return (
    <section
      id="ecommerce-logistics"
      aria-labelledby="ecommerce-heading"
      className="scroll-mt-24 bg-app px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-3xl bg-cream px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:py-14">
        {/* Left: message + CTA */}
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent-orange">
            E-COMMERCE LOGISTICS
          </p>

          <h2
            id="ecommerce-heading"
            className="mt-1 text-3xl font-extrabold text-dark-1 sm:text-4xl"
            style={{ lineHeight: 1.1, letterSpacing: "-0.01em" }}
          >
            Delivery that keeps up with your online orders
          </h2>

          <p className="mt-4 max-w-lg text-[16px] leading-7 text-dark-1/80">
            Sell on Instagram, Facebook or your own website? We pick
            up your orders, deliver them across Nepal and collect
            cash on delivery, so you can focus on selling.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-md bg-primary px-5 text-[14px] font-bold uppercase tracking-wide text-dark-1 shadow-[0_10px_24px_-12px_rgba(251,181,1,0.9)] transition-colors hover:bg-primary-light"
          >
            <MessageCircle size={22} strokeWidth={1.7} aria-hidden="true" />
            Talk to Us on WhatsApp
            <ArrowRight
              size={17}
              strokeWidth={2.2}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Right: features */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="rounded-2xl border border-black/5 bg-white p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/45 text-dark-1">
                <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[16px] font-extrabold text-dark-1">
                {title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-6 text-dark-1/75">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}