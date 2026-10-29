
import { Router, Request, Response } from "express";

const router = Router();

const aboutData = {
  companyName: "Aarambha Courier and Transport Service Pvt. Ltd.",

  headline: "Building a More Systematic Way to Move Deliveries.",

  description:
    "Sending a parcel should not feel uncertain. Behind every package is a seller, a buyer and a promise.",

  pillars: [
    {
      title: "Purpose",
      body: "Deliveries are promises made to someone waiting. We handle those promises with order, care and honest communication.",
    },
    {
      title: "Mission",
      body: "To provide vendors and customers with a courier service built on clear processes and reliable parcel tracking.",
    },
    {
      title: "Vision",
      body: "A Nepal where sending a parcel feels dependable and businesses can rely on organised logistics.",
    },
  ],

  practices: [
    {
      title: "Business-first logistics",
      body: "Delivery services planned around vendors, their orders and their customers.",
      image: "/images/about/vendor-handover.jpg",
    },
    {
      title: "Systematic operations",
      body: "Parcels are received, sorted, assigned and delivered through a defined workflow.",
      image: "/images/about/parcel-sorting.jpg",
    },
    {
      title: "Vendor relationships",
      body: "We support vendors through direct communication and practical delivery solutions.",
      image: "/images/about/vendor-support.jpg",
    },
    {
      title: "Responsible parcel handling",
      body: "Parcels are handled carefully, labelled correctly and protected throughout delivery.",
      image: "/images/about/careful-handling.jpg",
    },
  ],

  reasons: [
    {
      title: "Reliability",
      body: "Consistent processes for dependable deliveries.",
    },
    {
      title: "Communication",
      body: "Clear updates and straightforward communication.",
    },
    {
      title: "Transparency",
      body: "Honest updates when something changes or goes wrong.",
    },
    {
      title: "Systematic workflow",
      body: "Every parcel follows a defined delivery process.",
    },
    {
      title: "Vendor support",
      body: "Support for pickups, parcel handovers and follow-ups.",
    },
    {
      title: "Practical logistics",
      body: "Delivery solutions designed for real-world conditions in Nepal.",
    },
  ],
};

// GET /api/about
router.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "About page data retrieved successfully.",
    data: aboutData,
  });
});

export default router;
