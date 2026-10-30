
import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

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
type ParcelType = "parcel" | "document" | "fragile";
type ServiceType = "standard" | "express" | "same-day";

type RouteRate = {
  base: number;
  includedWeight: number;
  extraKg: number;
};

// Example locations from your frontend.
const locationGroups: Record<Zone, string[]> = {
  valley: [
    "kathmandu", "ktm", "lalitpur", "patan", "kupondole",
    "jawalakhel", "pulchowk", "satdobato", "bhaktapur",
    "thimi", "baneshwor", "new baneshwor", "koteshwor",
    "kalanki", "chabahil", "kirtipur", "gongabu",
    "boudha", "bouddha", "lagankhel", "imadol", "lubhu",
    "sanepa",
  ],
  nearby: [
    "banepa", "dhulikhel", "panauti", "kavre",
    "kavrepalanchok", "naubise", "dhading besi",
    "bidur", "nuwakot", "charikot", "dolakha",
  ],
  central: [
    "hetauda", "makwanpur", "bharatpur", "chitwan",
    "narayangarh", "sauraha", "birgunj", "parsa",
    "kalaiya", "bara", "janakpur", "dhanusha",
    "bardibas", "malangwa", "sarlahi", "simara",
  ],
  east: [
    "biratnagar", "morang", "itahari", "dharan",
    "inaruwa", "damak", "birtamod", "jhapa",
    "mechinagar", "kakarbhitta", "ilam", "fikkal",
    "dhankuta", "gaighat", "udayapur", "rajbiraj",
    "saptari", "siraha", "lahan", "okhaldhunga",
    "khotang", "salleri",
  ],
  west: [
    "pokhara", "kaski", "lekhnath", "syangja",
    "baglung", "kusma", "parbat", "butwal",
    "bhairahawa", "siddharthanagar", "rupandehi",
    "palpa", "tansen", "tulsipur", "ghorahi", "dang",
    "nepalgunj", "banke", "kohalpur", "gulmi",
    "kapilvastu",
  ],
  farwest: [
    "dhangadhi", "attariya", "kailali", "mahendranagar",
    "bhimdatta", "kanchanpur", "tikapur", "dadeldhura",
    "doti", "dipayal", "bajhang", "bajura", "achham",
    "bardia", "bardiya", "gulariya",
  ],
  remote: [
    "jumla", "juphal", "dolpa", "humla", "simikot",
    "mugu", "gamgadhi", "mustang", "jomsom", "manang",
    "lukla", "solukhumbu", "taplejung", "sankhuwasabha",
    "bhojpur", "terhathum", "myagdi", "rolpa", "rukum",
    "kalikot",
  ],
};

const zones = Object.keys(locationGroups) as Zone[];

function normalizeLocation(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ");
}

function resolveZone(value: string): Zone | null {
  const normalized = normalizeLocation(value);

  if (!normalized) return null;

  const matches = zones.flatMap((zone) =>
    locationGroups[zone].map((name) => ({ zone, name }))
  );

  matches.sort((a, b) => b.name.length - a.name.length);

  for (const item of matches) {
    const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|\\s)${escaped}(\\s|$)`);

    if (pattern.test(normalized)) return item.zone;
  }

  return null;
}

// Each row is the pickup zone; each column is the delivery zone.
const baseRates: Record<Zone, Record<Zone, number>> = {
  valley: {
    valley: 150, nearby: 220, central: 250, east: 300,
    west: 300, farwest: 350, remote: 500,
  },
  nearby: {
    valley: 220, nearby: 180, central: 250, east: 320,
    west: 320, farwest: 370, remote: 500,
  },
  central: {
    valley: 250, nearby: 250, central: 200, east: 300,
    west: 320, farwest: 400, remote: 550,
  },
  east: {
    valley: 300, nearby: 320, central: 300, east: 180,
    west: 400, farwest: 500, remote: 600,
  },
  west: {
    valley: 300, nearby: 320, central: 320, east: 400,
    west: 180, farwest: 300, remote: 500,
  },
  farwest: {
    valley: 350, nearby: 370, central: 400, east: 500,
    west: 300, farwest: 180, remote: 500,
  },
  remote: {
    valley: 500, nearby: 500, central: 550, east: 600,
    west: 500, farwest: 500, remote: 350,
  },
};

const extraKgRates: Record<Zone, Record<Zone, number>> = {
  valley: {
    valley: 40, nearby: 50, central: 60, east: 70,
    west: 70, farwest: 80, remote: 100,
  },
  nearby: {
    valley: 50, nearby: 40, central: 60, east: 70,
    west: 70, farwest: 80, remote: 100,
  },
  central: {
    valley: 60, nearby: 60, central: 45, east: 70,
    west: 70, farwest: 85, remote: 110,
  },
  east: {
    valley: 70, nearby: 70, central: 70, east: 40,
    west: 85, farwest: 100, remote: 120,
  },
  west: {
    valley: 70, nearby: 70, central: 70, east: 85,
    west: 40, farwest: 70, remote: 100,
  },
  farwest: {
    valley: 80, nearby: 80, central: 85, east: 100,
    west: 70, farwest: 40, remote: 100,
  },
  remote: {
    valley: 100, nearby: 100, central: 110, east: 120,
    west: 100, farwest: 100, remote: 80,
  },
};

const modeCharges: Record<DeliveryMode, number> = {
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

function calculateQuote(body: any) {
  const pickup = typeof body.pickup === "string" ? body.pickup.trim() : "";
  const delivery =
    typeof body.delivery === "string" ? body.delivery.trim() : "";

  const weight = Number(body.weight);
  const deliveryMode = body.deliveryMode as DeliveryMode;
  const deliveryType = body.deliveryType as DeliveryType;
  const service = body.service as ServiceType;
  const parcelType = body.parcelType as ParcelType;
  const cod = body.cod;

  if (!pickup || !delivery) {
    throw new Error("Pickup and delivery locations are required.");
  }

  const pickupZone = resolveZone(pickup);
  const deliveryZone = resolveZone(delivery);

  if (!pickupZone) {
    throw new Error(`Unrecognized pickup location: ${pickup}`);
  }

  if (!deliveryZone) {
    throw new Error(`Unrecognized delivery location: ${delivery}`);
  }

  if (!Number.isFinite(weight) || weight <= 0 || weight > 100) {
    throw new Error("Weight must be greater than 0 and no more than 100 kg.");
  }

  if (!["door-to-door", "door-to-branch"].includes(deliveryMode)) {
    throw new Error("Invalid delivery mode.");
  }

  if (!["regular", "scheduled", "priority"].includes(deliveryType)) {
    throw new Error("Invalid delivery type.");
  }

  if (!["standard", "express", "same-day"].includes(service)) {
    throw new Error("Invalid service speed.");
  }

  if (!["parcel", "document", "fragile"].includes(parcelType)) {
    throw new Error("Invalid parcel type.");
  }

  if (!["yes", "no"].includes(cod)) {
    throw new Error("COD must be yes or no.");
  }

  const rate: RouteRate = {
    base: baseRates[pickupZone][deliveryZone],
    includedWeight: 1,
    extraKg: extraKgRates[pickupZone][deliveryZone],
  };

  const extraWeight = Math.max(
    0,
    Math.ceil(weight - rate.includedWeight)
  );

  const extraWeightCharge = extraWeight * rate.extraKg;
  const modeCharge = modeCharges[deliveryMode];
  const typeCharge = deliveryTypeCharges[deliveryType];
  const speedCharge = serviceCharges[service];
  const parcelCharge = parcelCharges[parcelType];

  const subtotal =
    rate.base +
    extraWeightCharge +
    modeCharge +
    typeCharge +
    speedCharge +
    parcelCharge;

  const codCharge = cod === "yes" ? COD_FIXED_CHARGE : 0;

  return {
    pickup,
    delivery,
    pickupZone,
    deliveryZone,
    weight,
    deliveryMode,
    deliveryType,
    service,
    parcelType,
    cod,
    breakdown: {
      baseCharge: rate.base,
      includedWeight: rate.includedWeight,
      extraWeight,
      extraWeightCharge,
      deliveryModeCharge: modeCharge,
      deliveryTypeCharge: typeCharge,
      serviceCharge: speedCharge,
      specialCharge: parcelCharge,
      codCharge,
    },
    total: Math.round(subtotal + codCharge),
    currency: "NPR",
    pricingNotice: "Example estimate only; confirm the approved tariff.",
  };
}

// GET /api/calculator/locations
router.get("/locations", (_req: Request, res: Response) => {
  res.json({
    success: true,
    locations: zones.map((zone) => ({
      zone,
      label: zone,
      names: locationGroups[zone],
    })),
  });
});

// POST /api/calculator/quote
router.post("/quote", (req: Request, res: Response) => {
  try {
    const quote = calculateQuote(req.body);

    res.json({
      success: true,
      quote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to calculate quote.",
    });
  }
});

// POST /api/calculator/book
// Saves a quote-backed booking request to MongoDB.
router.post("/book", async (req: Request, res: Response) => {
  try {
    const quote = calculateQuote(req.body);

    const name =
      typeof req.body.customerName === "string"
        ? req.body.customerName.trim()
        : "";

    const phone =
      typeof req.body.phone === "string" ? req.body.phone.trim() : "";

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    if (!/^9[678]\d{8}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Nepali mobile number.",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is not connected. Please try again.",
      });
    }

    const CalculatorBooking =
      mongoose.models.CalculatorBooking ||
      mongoose.model(
        "CalculatorBooking",
        new mongoose.Schema(
          {
            customerName: { type: String, required: true, trim: true },
            phone: { type: String, required: true, trim: true },
            pickup: { type: String, required: true },
            delivery: { type: String, required: true },
            pickupZone: { type: String, required: true },
            deliveryZone: { type: String, required: true },
            weight: { type: Number, required: true },
            deliveryMode: { type: String, required: true },
            deliveryType: { type: String, required: true },
            service: { type: String, required: true },
            parcelType: { type: String, required: true },
            cod: { type: String, required: true },
            breakdown: { type: mongoose.Schema.Types.Mixed, required: true },
            estimatedCharge: { type: Number, required: true },
            status: {
              type: String,
              enum: ["REQUESTED", "CONFIRMED", "CANCELLED"],
              default: "REQUESTED",
            },
          },
          { timestamps: true }
        )
      );

    const booking = await CalculatorBooking.create({
      customerName: name,
      phone,
      ...quote,
      estimatedCharge: quote.total,
    });

    return res.status(201).json({
      success: true,
      message: "Booking request saved successfully.",
      booking: {
        id: booking._id,
        status: booking.get("status"),
        estimatedCharge: quote.total,
        currency: "NPR",
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to save booking.",
    });
  }
});

export default router;
