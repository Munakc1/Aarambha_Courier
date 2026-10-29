
"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  ChevronDown,
  MapPin,
  Package,
  Truck,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Route,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Zone =
  | "valley"
  | "nearby"
  | "central"
  | "east"
  | "west"
  | "farwest"
  | "remote";

type DeliveryMode = "door-to-door" | "door-to-branch";
type DeliveryType = "regular" | "scheduled" | "priority";
type CodOption = "yes" | "no";
type ParcelType = "parcel" | "document" | "fragile";
type ServiceType = "standard" | "express" | "same-day";

type RouteRate = {
  base: number;
  includedWeight: number;
  extraKg: number;
};

/* -------------------------------------------------------------------------- */
/* LOCATION DIRECTORY                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Example route rates in NPR.
 * Replace these example rates with approved Aarambha Courier rates.
 *
 * Users can enter a city, district, or recognized town.
 * The calculator uses the location directory to determine each zone.
 */

const locations: { zone: Zone; names: string[] }[] = [
  {
    zone: "valley",
    names: [
      "kathmandu",
      "ktm",
      "lalitpur",
      "patan",
      "kupondole",
      "jawalakhel",
      "pulchowk",
      "satdobato",
      "bhaktapur",
      "thimi",
      "baneshwor",
      "new baneshwor",
      "koteshwor",
      "kalanki",
      "chabahil",
      "kirtipur",
      "gongabu",
      "boudha",
      "bouddha",
      "lagankhel",
      "imadol",
      "lubhu",
      "sanepa",
    ],
  },
  {
    zone: "nearby",
    names: [
      "banepa",
      "dhulikhel",
      "panauti",
      "kavre",
      "kavrepalanchok",
      "naubise",
      "dhading besi",
      "bidur",
      "nuwakot",
      "charikot",
      "dolakha",
    ],
  },
  {
    zone: "central",
    names: [
      "hetauda",
      "makwanpur",
      "bharatpur",
      "chitwan",
      "narayangarh",
      "sauraha",
      "birgunj",
      "parsa",
      "kalaiya",
      "bara",
      "janakpur",
      "dhanusha",
      "bardibas",
      "malangwa",
      "sarlahi",
      "simara",
    ],
  },
  {
    zone: "east",
    names: [
      "biratnagar",
      "morang",
      "itahari",
      "dharan",
      "inaruwa",
      "damak",
      "birtamod",
      "jhapa",
      "mechinagar",
      "kakarbhitta",
      "ilam",
      "fikkal",
      "dhankuta",
      "gaighat",
      "udayapur",
      "rajbiraj",
      "saptari",
      "siraha",
      "lahan",
      "okhaldhunga",
      "khotang",
      "salleri",
    ],
  },
  {
    zone: "west",
    names: [
      "pokhara",
      "kaski",
      "lekhnath",
      "syangja",
      "baglung",
      "kusma",
      "parbat",
      "butwal",
      "bhairahawa",
      "siddharthanagar",
      "rupandehi",
      "palpa",
      "tansen",
      "tulsipur",
      "ghorahi",
      "dang",
      "nepalgunj",
      "banke",
      "kohalpur",
      "gulmi",
      "kapilvastu",
    ],
  },
  {
    zone: "farwest",
    names: [
      "dhangadhi",
      "dhangadhi",
      "attariya",
      "kailali",
      "mahendranagar",
      "bhimdatta",
      "kanchanpur",
      "tikapur",
      "dadeldhura",
      "doti",
      "dipayal",
      "bajhang",
      "bajura",
      "achham",
      "bardia",
      "bardiya",
      "gulariya",
    ],
  },
  {
    zone: "remote",
    names: [
      "jumla",
      "juphal",
      "dolpa",
      "humla",
      "simikot",
      "mugu",
      "gamgadhi",
      "mustang",
      "jomsom",
      "manang",
      "lukla",
      "solukhumbu",
      "taplejung",
      "sankhuwasabha",
      "bhojpur",
      "terhathum",
      "myagdi",
      "rolpa",
      "rukum",
      "kalikot",
    ],
  },
];

const zoneLabels: Record<Zone, string> = {
  valley: "Kathmandu Valley",
  nearby: "Nearby districts",
  central: "Central Nepal",
  east: "Eastern Nepal",
  west: "Western Nepal",
  farwest: "Far-Western Nepal",
  remote: "Remote / mountain areas",
};

/**
 * Example one-way route pricing.
 *
 * Rows = pickup zone.
 * Columns = delivery zone.
 *
 * These are configurable estimates, NOT verified company tariffs.
 */
const routeRates: Record<Zone, Record<Zone, RouteRate>> = {
  valley: {
    valley: { base: 150, includedWeight: 1, extraKg: 40 },
    nearby: { base: 220, includedWeight: 1, extraKg: 50 },
    central: { base: 250, includedWeight: 1, extraKg: 60 },
    east: { base: 300, includedWeight: 1, extraKg: 70 },
    west: { base: 300, includedWeight: 1, extraKg: 70 },
    farwest: { base: 350, includedWeight: 1, extraKg: 80 },
    remote: { base: 500, includedWeight: 1, extraKg: 100 },
  },
  nearby: {
    valley: { base: 220, includedWeight: 1, extraKg: 50 },
    nearby: { base: 180, includedWeight: 1, extraKg: 40 },
    central: { base: 250, includedWeight: 1, extraKg: 60 },
    east: { base: 320, includedWeight: 1, extraKg: 70 },
    west: { base: 320, includedWeight: 1, extraKg: 70 },
    farwest: { base: 370, includedWeight: 1, extraKg: 80 },
    remote: { base: 500, includedWeight: 1, extraKg: 100 },
  },
  central: {
    valley: { base: 250, includedWeight: 1, extraKg: 60 },
    nearby: { base: 250, includedWeight: 1, extraKg: 60 },
    central: { base: 200, includedWeight: 1, extraKg: 45 },
    east: { base: 300, includedWeight: 1, extraKg: 70 },
    west: { base: 320, includedWeight: 1, extraKg: 70 },
    farwest: { base: 400, includedWeight: 1, extraKg: 85 },
    remote: { base: 550, includedWeight: 1, extraKg: 110 },
  },
  east: {
    valley: { base: 300, includedWeight: 1, extraKg: 70 },
    nearby: { base: 320, includedWeight: 1, extraKg: 70 },
    central: { base: 300, includedWeight: 1, extraKg: 70 },
    east: { base: 180, includedWeight: 1, extraKg: 40 },
    west: { base: 400, includedWeight: 1, extraKg: 85 },
    farwest: { base: 500, includedWeight: 1, extraKg: 100 },
    remote: { base: 600, includedWeight: 1, extraKg: 120 },
  },
  west: {
    valley: { base: 300, includedWeight: 1, extraKg: 70 },
    nearby: { base: 320, includedWeight: 1, extraKg: 70 },
    central: { base: 320, includedWeight: 1, extraKg: 70 },
    east: { base: 400, includedWeight: 1, extraKg: 85 },
    west: { base: 180, includedWeight: 1, extraKg: 40 },
    farwest: { base: 300, includedWeight: 1, extraKg: 70 },
    remote: { base: 500, includedWeight: 1, extraKg: 100 },
  },
  farwest: {
    valley: { base: 350, includedWeight: 1, extraKg: 80 },
    nearby: { base: 370, includedWeight: 1, extraKg: 80 },
    central: { base: 400, includedWeight: 1, extraKg: 85 },
    east: { base: 500, includedWeight: 1, extraKg: 100 },
    west: { base: 300, includedWeight: 1, extraKg: 70 },
    farwest: { base: 180, includedWeight: 1, extraKg: 40 },
    remote: { base: 500, includedWeight: 1, extraKg: 100 },
  },
  remote: {
    valley: { base: 500, includedWeight: 1, extraKg: 100 },
    nearby: { base: 500, includedWeight: 1, extraKg: 100 },
    central: { base: 550, includedWeight: 1, extraKg: 110 },
    east: { base: 600, includedWeight: 1, extraKg: 120 },
    west: { base: 500, includedWeight: 1, extraKg: 100 },
    farwest: { base: 500, includedWeight: 1, extraKg: 100 },
    remote: { base: 350, includedWeight: 1, extraKg: 80 },
  },
};

const deliveryModeCharges: Record<DeliveryMode, number> = {
  "door-to-door": 30,
  "door-to-branch": 0,
};

const deliveryTypeCharges: Record<DeliveryType, number> = {
  regular: 0,
  scheduled: 50,
  priority: 100,
};

const serviceCharges: Record<ServiceType, number> = {
  standard: 0,
  express: 80,
  "same-day": 150,
};

const parcelCharges: Record<ParcelType, number> = {
  parcel: 0,
  document: 0,
  fragile: 50,
};

const COD_FIXED_CHARGE = 25;
const COD_PERCENTAGE = 0;

/* -------------------------------------------------------------------------- */
/* LOCATION HELPERS                                                           */
/* -------------------------------------------------------------------------- */

function normalizeLocation(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ");
}

function resolveZone(value: string): Zone | null {
  const normalized = normalizeLocation(value);

  if (!normalized) return null;

  // Match longer location names first to reduce partial-name collisions.
  const matches = locations
    .flatMap((group) =>
      group.names.map((name) => ({
        zone: group.zone,
        name,
      }))
    )
    .sort((a, b) => b.name.length - a.name.length);

  for (const item of matches) {
    const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|\\s)${escaped}(\\s|$)`);

    if (pattern.test(normalized)) {
      return item.zone;
    }
  }

  return null;
}

function money(amount: number) {
  return `Rs. ${Math.round(amount).toLocaleString("en-NP")}`;
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CalculatorPage() {
  const router = useRouter();

  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [deliveryMode, setDeliveryMode] =
    useState<DeliveryMode>("door-to-door");
  const [deliveryType, setDeliveryType] =
    useState<DeliveryType>("regular");
  const [weight, setWeight] = useState("1");
  const [parcelType, setParcelType] =
    useState<ParcelType>("parcel");
  const [cod, setCod] = useState<CodOption>("no");
  const [serviceType, setServiceType] =
    useState<ServiceType>("standard");
  const [error, setError] = useState("");

  const pickupZone = resolveZone(pickup);
  const deliveryZone = resolveZone(delivery);

  const calculation = useMemo(() => {
    const kg = Number(weight);

    if (
      !Number.isFinite(kg) ||
      kg <= 0 ||
      !pickupZone ||
      !deliveryZone
    ) {
      return null;
    }

    const rate = routeRates[pickupZone][deliveryZone];

    // Each started kilogram above the included weight is charged.
    const extraWeight = Math.max(
      0,
      Math.ceil(kg - rate.includedWeight)
    );

    const extraWeightCharge = extraWeight * rate.extraKg;
    const deliveryModeCharge = deliveryModeCharges[deliveryMode];
    const deliveryTypeCharge = deliveryTypeCharges[deliveryType];
    const serviceCharge = serviceCharges[serviceType];
    const specialCharge = parcelCharges[parcelType];

    const subtotal =
      rate.base +
      extraWeightCharge +
      deliveryModeCharge +
      deliveryTypeCharge +
      serviceCharge +
      specialCharge;

    const codCharge =
      cod === "yes"
        ? COD_FIXED_CHARGE + subtotal * (COD_PERCENTAGE / 100)
        : 0;

    return {
      baseCharge: rate.base,
      includedWeight: rate.includedWeight,
      extraWeight,
      extraWeightCharge,
      deliveryModeCharge,
      deliveryTypeCharge,
      serviceCharge,
      specialCharge,
      codCharge,
      total: subtotal + codCharge,
    };
  }, [
    pickupZone,
    deliveryZone,
    weight,
    deliveryMode,
    deliveryType,
    serviceType,
    parcelType,
    cod,
  ]);

  function validateForm() {
    if (!pickup.trim() || !delivery.trim()) {
      setError("Please enter both pickup and delivery locations.");
      return false;
    }

    if (!pickupZone) {
      setError(
        `Pickup location "${pickup}" is not in our example location directory. Enter a recognized town or district, or add it to the location directory.`
      );
      return false;
    }

    if (!deliveryZone) {
      setError(
        `Delivery location "${delivery}" is not in our example location directory. Enter a recognized town or district, or add it to the location directory.`
      );
      return false;
    }

    const kg = Number(weight);

    if (!Number.isFinite(kg) || kg <= 0) {
      setError("Package weight must be greater than 0 kg.");
      return false;
    }

    if (kg > 100) {
      setError("For packages over 100 kg, please contact our team for a quote.");
      return false;
    }

    setError("");
    return true;
  }

  function resetCalculator() {
    setPickup("");
    setDelivery("");
    setDeliveryMode("door-to-door");
    setDeliveryType("regular");
    setWeight("1");
    setParcelType("parcel");
    setCod("no");
    setServiceType("standard");
    setError("");
  }

 function continueToBooking() {
  if (!validateForm() || !calculation) return;

  // Narrow the types so TypeScript knows these are not null
  if (!pickupZone || !deliveryZone) return;

  const params = new URLSearchParams({
    pickup: pickup.trim(),
    delivery: delivery.trim(),
    pickupZone,
    deliveryZone,
    deliveryMode,
    deliveryType,
    weight,
    parcelType,
    cod,
    service: serviceType,
    estimatedCharge: String(calculation.total),
  });

  router.push(`/contact?${params.toString()}`);
}

  return (
    <main className="min-h-screen bg-app text-fg">
      <section className="relative overflow-hidden border-b border-hairline bg-cream">
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-white px-4 py-2 text-sm font-semibold text-dark-1">
              <Calculator className="h-4 w-4" />
              Delivery Charge Calculator
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-5xl">
              Estimate Your Delivery Charge
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Enter your pickup and delivery towns to calculate an
              estimated courier charge based on your route, parcel
              weight, and selected services.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-2xl border border-hairline bg-white shadow-sm">
            <div className="border-b border-hairline px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-dark-1">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Delivery Details</h2>
                  <p className="text-sm text-muted">
                    Enter your shipment information
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-7 px-6 py-7 sm:px-8">
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">
                  Shipment Locations
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Pickup Location">
                    <LocationInput
                      value={pickup}
                      onChange={(value) => {
                        setPickup(value);
                        setError("");
                      }}
                      placeholder="e.g. Kupondole, Lalitpur"
                    />
                    {pickup.trim() && (
                      <p className="mt-2 text-xs text-muted">
                        {pickupZone
                          ? `Detected zone: ${zoneLabels[pickupZone]}`
                          : "Location not recognized"}
                      </p>
                    )}
                  </FormField>

                  <FormField label="Delivery Location">
                    <LocationInput
                      value={delivery}
                      onChange={(value) => {
                        setDelivery(value);
                        setError("");
                      }}
                      placeholder="e.g. Pokhara, Kaski"
                    />
                    {delivery.trim() && (
                      <p className="mt-2 text-xs text-muted">
                        {deliveryZone
                          ? `Detected zone: ${zoneLabels[deliveryZone]}`
                          : "Location not recognized"}
                      </p>
                    )}
                  </FormField>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">
                  Delivery Mode
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ChoiceButton
                    active={deliveryMode === "door-to-door"}
                    onClick={() => setDeliveryMode("door-to-door")}
                    title="Door-to-Door"
                    description="Additional doorstep delivery fee"
                  />
                  <ChoiceButton
                    active={deliveryMode === "door-to-branch"}
                    onClick={() => setDeliveryMode("door-to-branch")}
                    title="Door-to-Branch"
                    description="Collect from a service branch"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Delivery Type"
                  value={deliveryType}
                  onChange={(v) => setDeliveryType(v as DeliveryType)}
                  options={[
                    { value: "regular", label: "Regular Delivery" },
                    { value: "scheduled", label: "Scheduled Delivery" },
                    { value: "priority", label: "Priority Delivery" },
                  ]}
                />

                <FormField label="Package Weight (kg)">
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                    <input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={weight}
                      onChange={(e) => {
                        setWeight(e.target.value);
                        setError("");
                      }}
                      className="w-full rounded-xl border border-hairline bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </FormField>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Package Type"
                  value={parcelType}
                  onChange={(v) => setParcelType(v as ParcelType)}
                  options={[
                    { value: "parcel", label: "Regular Parcel" },
                    { value: "document", label: "Document" },
                    { value: "fragile", label: "Fragile Package" },
                  ]}
                />

                <SelectField
                  label="Cash on Delivery (COD)"
                  value={cod}
                  onChange={(v) => setCod(v as CodOption)}
                  options={[
                    { value: "no", label: "No COD" },
                    { value: "yes", label: "Yes, Cash on Delivery" },
                  ]}
                />
              </div>

              <SelectField
                label="Service Speed"
                value={serviceType}
                onChange={(v) => setServiceType(v as ServiceType)}
                options={[
                  { value: "standard", label: "Standard" },
                  { value: "express", label: "Express (+Rs. 80)" },
                  { value: "same-day", label: "Same-Day (+Rs. 150)" },
                ]}
              />

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={resetCalculator}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-dark-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Calculator
              </button>
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-2xl border border-primary bg-white shadow-sm">
              <div className="bg-dark-1 px-6 py-6 text-white">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">
                    Estimated Delivery Charge
                  </span>
                </div>

                <div className="mt-4 text-4xl font-bold">
                  {calculation ? money(calculation.total) : "—"}
                </div>

                <p className="mt-2 text-sm text-white/65">
                  {pickupZone && deliveryZone
                    ? `${zoneLabels[pickupZone]} → ${zoneLabels[deliveryZone]}`
                    : "Enter recognized pickup and delivery locations."}
                </p>
              </div>

              <div className="px-6 py-6">
                <h3 className="mb-5 font-bold">Charge Breakdown</h3>

                {calculation ? (
                  <div className="space-y-4 text-sm">
                    <ChargeRow
                      label="Route Base Charge"
                      amount={calculation.baseCharge}
                    />
                    <ChargeRow
                      label={`Included Weight (${calculation.includedWeight} kg)`}
                      amount={0}
                    />
                    <ChargeRow
                      label={`Additional Weight (${calculation.extraWeight} kg)`}
                      amount={calculation.extraWeightCharge}
                    />
                    <ChargeRow
                      label="Delivery Mode"
                      amount={calculation.deliveryModeCharge}
                    />
                    <ChargeRow
                      label="Delivery Type"
                      amount={calculation.deliveryTypeCharge}
                    />
                    <ChargeRow
                      label="Service Speed"
                      amount={calculation.serviceCharge}
                    />
                    <ChargeRow
                      label="Fragile Handling"
                      amount={calculation.specialCharge}
                    />
                    <ChargeRow
                      label="COD Fee"
                      amount={calculation.codCharge}
                    />

                    <div className="border-t border-hairline pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold">Estimated Total</span>
                        <span className="text-xl font-bold text-dark-1">
                          {money(calculation.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    Enter recognized locations and a valid package
                    weight to see the route-based estimate.
                  </p>
                )}

                <div className="mt-6 rounded-xl border border-primary/30 bg-cream p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-dark-1" />
                    <p className="text-xs leading-5 text-dark-1/75">
                      Example pricing only. Actual charges may vary by
                      exact address, service availability, parcel
                      dimensions, and the approved Aarambha tariff.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={continueToBooking}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-dark-1 hover:opacity-90"
                >
                  Continue to Booking
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* REUSABLE COMPONENTS                                                        */
/* -------------------------------------------------------------------------- */

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-fg">
        {label}
      </label>
      {children}
    </div>
  );
}

function LocationInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl border border-hairline bg-white py-3 pl-10 pr-4 text-sm outline-none placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <FormField label={label}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-hairline bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
      </div>
    </FormField>
  );
}

function ChoiceButton({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-primary bg-cream ring-1 ring-primary"
          : "border-hairline bg-white hover:border-primary/50"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{title}</span>
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            active
              ? "border-primary bg-primary"
              : "border-faint bg-white"
          }`}
        >
          {active && (
            <span className="h-1.5 w-1.5 rounded-full bg-dark-1" />
          )}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">{description}</p>
    </button>
  );
}

function ChargeRow({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{money(amount)}</span>
    </div>
  );
}
