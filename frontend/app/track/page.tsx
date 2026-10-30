"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Package,
  RotateCcw,
  Search,
  Truck,
} from "lucide-react";

type ShipmentStatus =
  | "Package Created"
  | "Picked Up"
  | "Arrived at Office"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Return"
  | "Return to Vendor";

type Shipment = {
  trackingNumber: string;
  status: ShipmentStatus;
  lastUpdate: string;
  origin: string;
  destination: string;
  parcelType: string;
  weight: string;
  recipient: string;
  createdDate: string;
};

const TIMELINE: ShipmentStatus[] = [
  "Package Created",
  "Picked Up",
  "Arrived at Office",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const DEMO_SHIPMENTS: Record<string, Shipment> = {
  ARB123456789: {
    trackingNumber: "ARB123456789",
    status: "In Transit",
    lastUpdate: "05 Oct 2026, 10:30 AM",
    origin: "Kathmandu",
    destination: "Pokhara",
    parcelType: "Parcel",
    weight: "1.5 kg",
    recipient: "Demo Customer",
    createdDate: "04 Oct 2026",
  },

  ARB987654321: {
    trackingNumber: "ARB987654321",
    status: "Delivered",
    lastUpdate: "05 Oct 2026, 01:45 PM",
    origin: "Lalitpur",
    destination: "Bhaktapur",
    parcelType: "Document",
    weight: "0.5 kg",
    recipient: "Demo Customer",
    createdDate: "04 Oct 2026",
  },

  ARB555555555: {
    trackingNumber: "ARB555555555",
    status: "Out for Delivery",
    lastUpdate: "05 Oct 2026, 11:15 AM",
    origin: "Kathmandu",
    destination: "Lalitpur",
    parcelType: "Parcel",
    weight: "2 kg",
    recipient: "Demo Customer",
    createdDate: "05 Oct 2026",
  },

  ARB444444444: {
    trackingNumber: "ARB444444444",
    status: "Return",
    lastUpdate: "05 Oct 2026, 09:20 AM",
    origin: "Kathmandu",
    destination: "Chitwan",
    parcelType: "Parcel",
    weight: "1 kg",
    recipient: "Demo Customer",
    createdDate: "03 Oct 2026",
  },

  ARB333333333: {
    trackingNumber: "ARB333333333",
    status: "Return to Vendor",
    lastUpdate: "05 Oct 2026, 08:40 AM",
    origin: "Lalitpur",
    destination: "Kathmandu",
    parcelType: "Parcel",
    weight: "3 kg",
    recipient: "Demo Customer",
    createdDate: "02 Oct 2026",
  },
};

const WHATSAPP_NUMBER = "9801255799";

function openWhatsApp(message: string) {
  const url = `https://wa.me/977${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

function getStatusIndex(status: ShipmentStatus) {
  if (status === "Delivered") return 5;

  if (status === "Return" || status === "Return to Vendor") {
    return 3;
  }

  return TIMELINE.indexOf(status);
}

function StatusBadge({ status }: { status: ShipmentStatus }) {
  const isDelivered = status === "Delivered";
  const isReturn =
    status === "Return" || status === "Return to Vendor";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
        isDelivered
          ? "bg-primary/15 text-primary"
          : isReturn
            ? "bg-red-500/10 text-red-600"
            : "bg-primary/10 text-primary"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isReturn ? "bg-red-500" : "bg-primary"
        }`}
      />
      {status}
    </span>
  );
}

function TimelineItem({
  label,
  index,
  currentIndex,
  currentStatus,
}: {
  label: ShipmentStatus;
  index: number;
  currentIndex: number;
  currentStatus: ShipmentStatus;
}) {
  const completed = index < currentIndex;
  const active = index === currentIndex;

  const isReturn =
    currentStatus === "Return" || currentStatus === "Return to Vendor";

  return (
    <div className="relative flex gap-4">
      <div className="relative flex w-8 shrink-0 justify-center">
        <div
          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
            active
              ? "border-primary bg-primary text-dark-1"
              : completed
                ? "border-primary bg-primary/15 text-primary"
                : "border-hairline bg-panel text-faint"
          }`}
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : active ? (
            <span className="h-2.5 w-2.5 rounded-full bg-dark-1" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-current" />
          )}
        </div>

        {index < TIMELINE.length - 1 && (
          <div
            className={`absolute left-1/2 top-8 h-[calc(100%+1rem)] w-0.5 -translate-x-1/2 ${
              completed ? "bg-primary" : "bg-hairline"
            }`}
          />
        )}
      </div>

      <div className="pb-9">
        <p
          className={`text-sm font-bold ${
            active
              ? isReturn
                ? "text-red-600"
                : "text-fg"
              : completed
                ? "text-fg"
                : "text-faint"
          }`}
        >
          {label}
        </p>

        {active && (
          <p className="mt-1 text-xs text-muted">
            Current shipment status
          </p>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <p className="text-xs text-faint">{label}</p>

      <p className="mt-1 text-sm font-bold text-fg">{value}</p>
    </div>
  );
}

export default function TrackShipmentPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [searched, setSearched] = useState(false);

  function handleTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = trackingNumber.trim().toUpperCase();

    setShipment(DEMO_SHIPMENTS[normalized] ?? null);
    setSearched(true);
  }

  function handleWhatsApp() {
    const message = shipment
      ? `Hello Aarambha Courier, I need support regarding tracking number ${shipment.trackingNumber}.`
      : `Hello Aarambha Courier, I need help finding my shipment. My tracking number is ${
          trackingNumber.trim() || "not available"
        }.`;

    openWhatsApp(message);
  }

  const currentIndex = useMemo(() => {
    if (!shipment) return -1;
    return getStatusIndex(shipment.status);
  }, [shipment]);

  return (
    <main className="bg-app">
      {/* HERO */}
      <section className="relative overflow-hidden bg-dark-1">
        <div className="absolute inset-0 grid-bg opacity-25" />

        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Package className="h-4 w-4" />
            Aarambha Shipment Tracking
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Track Your
            <span className="text-primary"> Shipment</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
            Enter your Aarambha tracking number to check the latest shipment
            status.
          </p>

          {/* TRACKING SEARCH */}
          <form
            onSubmit={handleTrack}
            className="mx-auto mt-9 max-w-2xl"
          >
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(event) =>
                    setTrackingNumber(event.target.value)
                  }
                  placeholder="Enter tracking number"
                  aria-label="Tracking number"
                  className="h-14 w-full rounded-xl border border-white/10 bg-dark-1 pl-12 pr-4 text-sm font-semibold uppercase tracking-wide text-white outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-black text-dark-1 transition hover:bg-primary-light"
              >
                Track Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs text-white/30">
            Enter the tracking number provided by Aarambha Courier.
          </p>
        </div>
      </section>

      {/* RESULTS */}
      <section className="bg-surface py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* NO RESULT */}
          {searched && !shipment && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-hairline bg-panel p-6 text-center shadow-sm sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <AlertCircle className="h-7 w-7 text-primary" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-fg">
                We couldn't find this shipment.
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
                Please check your tracking number or contact Aarambha
                support.
              </p>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to Support on WhatsApp
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!searched && (
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Search className="h-7 w-7 text-primary" />
              </div>

              <h2 className="mt-6 text-2xl font-black text-fg">
                Check your shipment status
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Enter your tracking number above to view the available
                shipment information and delivery progress.
              </p>
            </div>
          )}

          {/* SHIPMENT RESULT */}
          {shipment && (
            <div className="space-y-6">
              {/* SUMMARY */}
              <div className="rounded-3xl border border-hairline bg-panel p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-faint">
                      Tracking Number
                    </p>

                    <p className="mt-2 text-2xl font-black tracking-wide text-fg">
                      {shipment.trackingNumber}
                    </p>
                  </div>

                  <StatusBadge status={shipment.status} />
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={MapPin}
                    label="Origin"
                    value={shipment.origin}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Destination"
                    value={shipment.destination}
                  />

                  <InfoItem
                    icon={Package}
                    label="Shipment Type"
                    value={shipment.parcelType}
                  />

                  <InfoItem
                    icon={Truck}
                    label="Approximate Weight"
                    value={shipment.weight}
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-primary" />

                    <div>
                      <p className="text-xs text-faint">
                        Last Update
                      </p>

                      <p className="mt-1 text-sm font-bold text-fg">
                        {shipment.lastUpdate}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted">
                    Shipment created {shipment.createdDate}
                  </p>
                </div>
              </div>

              {/* DELIVERY PROGRESS */}
              <div className="rounded-3xl border border-hairline bg-panel p-5 shadow-sm sm:p-7">
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-faint">
                    Delivery Progress
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-fg">
                    Shipment Timeline
                  </h2>
                </div>

                <div className="max-w-2xl">
                  {TIMELINE.map((item, index) => (
                    <TimelineItem
                      key={item}
                      label={item}
                      index={index}
                      currentIndex={currentIndex}
                      currentStatus={shipment.status}
                    />
                  ))}
                </div>

                {(shipment.status === "Return" ||
                  shipment.status === "Return to Vendor") && (
                  <div className="mt-2 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                    <div className="flex gap-3">
                      <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                      <div>
                        <p className="font-bold text-fg">
                          {shipment.status}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted">
                          This shipment is currently following a return
                          process. Please contact Aarambha support if you need
                          more information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BASIC SHIPMENT INFORMATION */}
              <div className="rounded-3xl border border-hairline bg-panel p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-faint">
                    Shipment Information
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-fg">
                    Basic Details
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border-b border-hairline pb-4 sm:border-b-0">
                    <p className="text-xs text-faint">Recipient</p>
                    <p className="mt-1 text-sm font-bold text-fg">
                      {shipment.recipient}
                    </p>
                  </div>

                  <div className="border-b border-hairline pb-4 sm:border-b-0">
                    <p className="text-xs text-faint">Shipment Type</p>
                    <p className="mt-1 text-sm font-bold text-fg">
                      {shipment.parcelType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-faint">Origin</p>
                    <p className="mt-1 text-sm font-bold text-fg">
                      {shipment.origin}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-faint">Destination</p>
                    <p className="mt-1 text-sm font-bold text-fg">
                      {shipment.destination}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUPPORT */}
              <div className="rounded-3xl bg-dark-1 p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                      Need Help?
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-white">
                      Have a question about this shipment?
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
                      Contact Aarambha support with your tracking number and
                      our team can help with your inquiry.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Talk to Support on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW TO TRACK */}
      <section className="bg-cream py-14 sm:py-18">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="Track in Three Simple Steps"
            description="Use the tracking number provided by Aarambha to check the available shipment status."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-hairline bg-white-soft p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-black text-dark-1">
                01
              </div>

              <h3 className="mt-5 font-black text-fg">
                Find Your Tracking Number
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Use the Aarambha tracking number associated with your
                shipment.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-white-soft p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-black text-dark-1">
                02
              </div>

              <h3 className="mt-5 font-black text-fg">
                Enter It Above
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Enter the tracking number in the tracking interface and select
                Track Now.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-white-soft p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-black text-dark-1">
                03
              </div>

              <h3 className="mt-5 font-black text-fg">
                View Shipment Progress
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Review the current status, latest update, and shipment
                timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-dark-1 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <MessageCircle className="h-7 w-7 text-primary" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Need help with your shipment?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/50">
            Talk directly with Aarambha support about your shipment or
            tracking inquiry.
          </p>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-dark-1 transition hover:bg-primary-light"
          >
            <MessageCircle className="h-4 w-4" />
            Talk to Support on WhatsApp
          </button>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-text-grey">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-black tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
        {description}
      </p>
    </div>
  );
}