"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  ChevronDown,
  MapPin,
  Package,
  Truck,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                              TYPES                                         */
/* -------------------------------------------------------------------------- */

type ValleyType = "inside" | "outside";
type DeliveryMode = "door-to-door" | "door-to-branch";
type CodOption = "yes" | "no";

type DeliveryRule = {
  baseCharge: number;
  includedWeight: number;
  extraKgCharge: number;
};

type PricingConfig = {
  inside: DeliveryRule;
  outside: DeliveryRule;

  deliveryModes: {
    "door-to-door": number;
    "door-to-branch": number;
  };

  services: Record<string, number>;

  cod: {
    fixed: number;
    percentage: number;
  };

  specialRules: {
    fragile: number;
    document: number;
    parcel: number;
  };
};

/* -------------------------------------------------------------------------- */
/*                       ADMIN-MANAGEABLE CONFIG                              */
/* -------------------------------------------------------------------------- */

/**
 * This pricing object is intentionally kept separate from the UI.
 *
 * Later these values can come from:
 * - Admin dashboard
 * - CMS
 * - Database
 * - API
 *
 * The calculator UI does not need to change.
 *
 * IMPORTANT:
 * These are example values for development.
 * Replace them with Aarambha's official tariff before production.
 */

const pricingConfig: PricingConfig = {
  inside: {
    baseCharge: 150,
    includedWeight: 1,
    extraKgCharge: 40,
  },

  outside: {
    baseCharge: 250,
    includedWeight: 1,
    extraKgCharge: 70,
  },

  deliveryModes: {
    "door-to-door": 30,
    "door-to-branch": 0,
  },

  services: {
    standard: 0,
    express: 80,
    "same-day": 150,
  },

  cod: {
    fixed: 25,
    percentage: 0,
  },

  specialRules: {
    fragile: 50,
    document: 0,
    parcel: 0,
  },
};

/* -------------------------------------------------------------------------- */
/*                            PAGE                                            */
/* -------------------------------------------------------------------------- */

export default function CalculatorPage() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");

  const [valleyType, setValleyType] =
    useState<ValleyType>("inside");

  const [deliveryMode, setDeliveryMode] =
    useState<DeliveryMode>("door-to-door");

  const [deliveryType, setDeliveryType] =
    useState("regular");

  const [weight, setWeight] = useState("1");

  const [parcelType, setParcelType] =
    useState("parcel");

  const [cod, setCod] =
    useState<CodOption>("no");

  const [serviceType, setServiceType] =
    useState("standard");

  /* ------------------------------------------------------------------------ */
  /*                         CALCULATION                                      */
  /* ------------------------------------------------------------------------ */

  const calculation = useMemo(() => {
    const numericWeight = Math.max(
      0.1,
      Number(weight) || 0
    );

    const locationRule =
      pricingConfig[valleyType];

    const baseCharge =
      locationRule.baseCharge;

    const extraWeight = Math.max(
      0,
      Math.ceil(
        numericWeight -
          locationRule.includedWeight
      )
    );

    const extraWeightCharge =
      extraWeight *
      locationRule.extraKgCharge;

    const deliveryModeCharge =
      pricingConfig.deliveryModes[
        deliveryMode
      ];

    const serviceCharge =
      pricingConfig.services[
        serviceType
      ] ?? 0;

    const specialCharge =
      pricingConfig.specialRules[
        parcelType as keyof typeof pricingConfig.specialRules
      ] ?? 0;

    const codCharge =
      cod === "yes"
        ? pricingConfig.cod.fixed
        : 0;

    /*
     * Delivery type currently does not add a charge
     * because no official Aarambha pricing was provided
     * for regular/scheduled/priority delivery.
     *
     * Keep this variable ready for future admin pricing.
     */
    const deliveryTypeCharge = 0;

    const total =
      baseCharge +
      extraWeightCharge +
      deliveryModeCharge +
      serviceCharge +
      specialCharge +
      codCharge +
      deliveryTypeCharge;

    return {
      baseCharge,
      extraWeightCharge,
      deliveryModeCharge,
      serviceCharge,
      specialCharge,
      codCharge,
      deliveryTypeCharge,
      total,
      extraWeight,
    };
  }, [
    valleyType,
    deliveryMode,
    serviceType,
    parcelType,
    weight,
    cod,
    deliveryType,
  ]);

  /* ------------------------------------------------------------------------ */
  /*                            RESET                                         */
  /* ------------------------------------------------------------------------ */

  const resetCalculator = () => {
    setPickup("");
    setDelivery("");
    setValleyType("inside");
    setDeliveryMode("door-to-door");
    setDeliveryType("regular");
    setWeight("1");
    setParcelType("parcel");
    setCod("no");
    setServiceType("standard");
  };

  /* ------------------------------------------------------------------------ */
  /*                            RENDER                                        */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-app text-fg">

      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden border-b border-hairline bg-cream">

        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10"
          aria-hidden="true"
        />

        <div
          className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent-orange/10"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-white px-4 py-2 text-sm font-semibold text-dark-1 shadow-sm">
              <Calculator className="h-4 w-4" />
              Delivery Charge Calculator
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Estimate Your Delivery Charge
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Get an estimated courier charge based on
              your pickup, delivery, weight, and service
              requirements.
            </p>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CALCULATOR                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">

          {/* -------------------------------------------------------------- */}
          {/* FORM                                                           */}
          {/* -------------------------------------------------------------- */}

          <div className="rounded-2xl border border-hairline bg-white shadow-sm">

            {/* Card Header */}

            <div className="border-b border-hairline px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-dark-1">
                  <Truck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-fg">
                    Delivery Details
                  </h2>

                  <p className="text-sm text-muted">
                    Enter your shipment information
                  </p>
                </div>

              </div>

            </div>

            {/* Form */}

            <div className="space-y-7 px-6 py-7 sm:px-8">

              {/* -------------------------------------------------------- */}
              {/* LOCATION                                                 */}
              {/* -------------------------------------------------------- */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">
                  Shipment Location
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Pickup */}

                  <FormField label="Pickup location">

                    <div className="relative">

                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />

                      <input
                        value={pickup}
                        onChange={(e) =>
                          setPickup(e.target.value)
                        }
                        placeholder="e.g. Kupondole, Lalitpur"
                        className="w-full rounded-xl border border-hairline bg-white py-3 pl-10 pr-4 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />

                    </div>

                  </FormField>

                  {/* Delivery */}

                  <FormField label="Delivery location">

                    <div className="relative">

                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />

                      <input
                        value={delivery}
                        onChange={(e) =>
                          setDelivery(e.target.value)
                        }
                        placeholder="e.g. Baneshwor, Kathmandu"
                        className="w-full rounded-xl border border-hairline bg-white py-3 pl-10 pr-4 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />

                    </div>

                  </FormField>

                </div>

              </div>

              {/* -------------------------------------------------------- */}
              {/* AREA                                                     */}
              {/* -------------------------------------------------------- */}

              <div>

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">
                  Delivery Area
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">

                  <ChoiceButton
                    active={valleyType === "inside"}
                    onClick={() =>
                      setValleyType("inside")
                    }
                    title="Inside Valley"
                    description="Kathmandu Valley delivery"
                  />

                  <ChoiceButton
                    active={valleyType === "outside"}
                    onClick={() =>
                      setValleyType("outside")
                    }
                    title="Outside Valley"
                    description="Outside Kathmandu Valley"
                  />

                </div>

              </div>

              {/* -------------------------------------------------------- */}
              {/* DELIVERY MODE / TYPE                                    */}
              {/* -------------------------------------------------------- */}

              <div className="grid gap-5 sm:grid-cols-2">

                <SelectField
                  label="Delivery mode"
                  value={deliveryMode}
                  onChange={(value) =>
                    setDeliveryMode(
                      value as DeliveryMode
                    )
                  }
                  options={[
                    {
                      value: "door-to-door",
                      label: "Door-to-door",
                    },
                    {
                      value: "door-to-branch",
                      label: "Door-to-branch",
                    },
                  ]}
                />

                <SelectField
                  label="Delivery type"
                  value={deliveryType}
                  onChange={setDeliveryType}
                  options={[
                    {
                      value: "regular",
                      label: "Regular Delivery",
                    },
                    {
                      value: "scheduled",
                      label: "Scheduled Delivery",
                    },
                    {
                      value: "priority",
                      label: "Priority Delivery",
                    },
                  ]}
                />

              </div>

              {/* -------------------------------------------------------- */}
              {/* WEIGHT / PARCEL                                          */}
              {/* -------------------------------------------------------- */}

              <div className="grid gap-5 sm:grid-cols-2">

                <FormField label="Weight (kg)">

                  <div className="relative">

                    <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />

                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={weight}
                      onChange={(e) =>
                        setWeight(e.target.value)
                      }
                      className="w-full rounded-xl border border-hairline bg-white py-3 pl-10 pr-4 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                  </div>

                </FormField>

                <SelectField
                  label="Parcel type"
                  value={parcelType}
                  onChange={setParcelType}
                  options={[
                    {
                      value: "parcel",
                      label: "Regular Parcel",
                    },
                    {
                      value: "document",
                      label: "Document",
                    },
                    {
                      value: "fragile",
                      label: "Fragile Item",
                    },
                  ]}
                />

              </div>

              {/* -------------------------------------------------------- */}
              {/* COD / SERVICE                                            */}
              {/* -------------------------------------------------------- */}

              <div className="grid gap-5 sm:grid-cols-2">

                <SelectField
                  label="COD"
                  value={cod}
                  onChange={(value) =>
                    setCod(value as CodOption)
                  }
                  options={[
                    {
                      value: "no",
                      label: "No COD",
                    },
                    {
                      value: "yes",
                      label: "Yes, Cash on Delivery",
                    },
                  ]}
                />

                <SelectField
                  label="Service type"
                  value={serviceType}
                  onChange={setServiceType}
                  options={[
                    {
                      value: "standard",
                      label: "Standard",
                    },
                    {
                      value: "express",
                      label: "Express",
                    },
                    {
                      value: "same-day",
                      label: "Same Day",
                    },
                  ]}
                />

              </div>

              {/* -------------------------------------------------------- */}
              {/* RESET                                                    */}
              {/* -------------------------------------------------------- */}

              <button
                type="button"
                onClick={resetCalculator}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-dark-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset calculator
              </button>

            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* RESULT                                                         */}
          {/* -------------------------------------------------------------- */}

          <aside className="h-fit lg:sticky lg:top-28">

            <div className="overflow-hidden rounded-2xl border border-primary bg-white shadow-sm">

              {/* Result Header */}

              <div className="bg-dark-1 px-6 py-6 text-white">

                <div className="flex items-center gap-3">

                  <Calculator className="h-5 w-5 text-primary" />

                  <span className="text-sm font-semibold">
                    Estimated Delivery Charge
                  </span>

                </div>

                <div className="mt-4 flex items-end gap-2">

                  <span className="text-4xl font-bold">
                    Rs.{" "}
                    {calculation.total.toLocaleString(
                      "en-NP"
                    )}
                  </span>

                </div>

                <p className="mt-2 text-sm text-white/65">
                  Estimated based on the information
                  provided.
                </p>

              </div>

              {/* Breakdown */}

              <div className="px-6 py-6">

                <h3 className="mb-5 font-bold text-fg">
                  Charge Breakdown
                </h3>

                <div className="space-y-4 text-sm">

                  <ChargeRow
                    label="Base charge"
                    amount={calculation.baseCharge}
                  />

                  <ChargeRow
                    label={`Extra weight${
                      calculation.extraWeight > 0
                        ? ` (${calculation.extraWeight} kg)`
                        : ""
                    }`}
                    amount={
                      calculation.extraWeightCharge
                    }
                  />

                  <ChargeRow
                    label="Delivery mode"
                    amount={
                      calculation.deliveryModeCharge
                    }
                  />

                  <ChargeRow
                    label="Service charge"
                    amount={
                      calculation.serviceCharge
                    }
                  />

                  {calculation.specialCharge > 0 && (
                    <ChargeRow
                      label="Special handling"
                      amount={
                        calculation.specialCharge
                      }
                    />
                  )}

                  <ChargeRow
                    label="COD charge"
                    amount={calculation.codCharge}
                  />

                  {/* Total */}

                  <div className="border-t border-hairline pt-4">

                    <div className="flex items-center justify-between">

                      <span className="font-bold text-fg">
                        Estimated total
                      </span>

                      <span className="text-xl font-bold text-dark-1">
                        Rs.{" "}
                        {calculation.total.toLocaleString(
                          "en-NP"
                        )}
                      </span>

                    </div>

                  </div>

                </div>

                {/* ------------------------------------------------------ */}
                {/* NOTICE                                                  */}
                {/* ------------------------------------------------------ */}

                <div className="mt-6 rounded-xl border border-primary/30 bg-cream p-4">

                  <div className="flex gap-3">

                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-dark-1" />

                    <p className="text-xs leading-5 text-dark-1/75">
                      This is an estimated delivery
                      charge. Final charge may vary
                      after verification by Aarambha
                      Courier.
                    </p>

                  </div>

                </div>

                {/* ------------------------------------------------------ */}
                {/* CTA                                                     */}
                {/* ------------------------------------------------------ */}

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-dark-1 transition hover:opacity-90"
                >
                  Continue with Booking

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
/*                              FORM FIELD                                    */
/* -------------------------------------------------------------------------- */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
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

/* -------------------------------------------------------------------------- */
/*                              SELECT FIELD                                  */
/* -------------------------------------------------------------------------- */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <FormField label={label}>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full appearance-none rounded-xl border border-hairline bg-white px-4 py-3 pr-10 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />

      </div>

    </FormField>
  );
}

/* -------------------------------------------------------------------------- */
/*                            CHOICE BUTTON                                   */
/* -------------------------------------------------------------------------- */

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
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? "border-primary bg-cream ring-1 ring-primary"
          : "border-hairline bg-white hover:border-primary/50"
      }`}
    >
      <div className="flex items-center justify-between">

        <span className="font-semibold text-fg">
          {title}
        </span>

        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
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

      <p className="mt-1 text-xs text-muted">
        {description}
      </p>

    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                              CHARGE ROW                                    */
/* -------------------------------------------------------------------------- */

function ChargeRow({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-muted">
        {label}
      </span>

      <span className="font-semibold text-fg">
        Rs.{" "}
        {amount.toLocaleString("en-NP")}
      </span>

    </div>
  );
}