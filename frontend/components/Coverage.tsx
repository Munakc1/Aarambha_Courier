
import { Truck, ShieldCheck, PackageCheck } from "lucide-react";
import NepalMap from "./NepalMap";

const benefits = [
  {
    icon: Truck,
    title: "Wide Network",
    subtitle: "Across Nepal",
  },
  {
    icon: ShieldCheck,
    title: "Trusted &",
    subtitle: "Reliable",
  },
  {
    icon: PackageCheck,
    title: "Safe Handling",
    subtitle: "Assurance",
  },
];

export default function Coverage() {
  return (
    <section
      id="coverage"
      aria-labelledby="coverage-heading"
      className="bg-app px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left: Nationwide Delivery Content */}
          <div className="w-full">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">
              Nationwide Delivery
            </p>

            <h2
              id="coverage-heading"
              className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl lg:text-[42px]"
            >
              Send Personal Packages
              <span className="block">Across Nepal</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
              Whether you are in Kathmandu or any part of Nepal, we help
              you send parcels to your family, friends, students, offices,
              and relatives in every city and village.
            </p>

            <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
              With our wide network and trusted delivery partners, your
              package reaches its destination safely and on time.
            </p>

            {/* Trust Features */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-primary/30 border border-border bg-panel px-3 py-5 sm:px-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="flex flex-col items-center gap-2 px-2 text-center sm:flex-row sm:justify-center sm:gap-3"
                  >
                    <Icon
                      size={25}
                      strokeWidth={2}
                      className="shrink-0 text-primary"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[11px] font-bold leading-4 text-fg sm:text-xs">
                        {benefit.title}
                      </p>
                      <p className="text-[11px] font-semibold leading-4 text-fg sm:text-xs">
                        {benefit.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Nepal Interactive Map */}
          <div className="min-w-0 w-full">
            <div className="overflow-hidden border border-border bg-panel">
              <NepalMap />
            </div>

            <p className="mt-3 text-xs leading-5 text-muted">
              Explore highlighted locations across Nepal. Delivery
              availability depends on the destination and operational
              arrangements.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
