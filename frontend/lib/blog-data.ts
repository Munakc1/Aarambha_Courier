export type BlogCategory =
  | "Courier Tips"
  | "E-commerce Logistics"
  | "COD Guidance"
  | "Packaging Tips"
  | "Delivery Updates"
  | "Aarambha News";

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  image: string;
  imageAlt: string;
  readTime: string;
  content: {
    type: "paragraph" | "heading" | "list";
    text?: string;
    items?: string[];
  }[];
};

export const blogArticles: BlogArticle[] = [
  {
    slug: "how-to-prepare-a-parcel-for-courier-delivery",
    title: "How to Prepare a Parcel for Courier Delivery",
    excerpt:
      "Simple practical steps for preparing parcels before handing them over to a courier service.",
    category: "Courier Tips",
    date: "2026-10-05",
    image: "/images/blog/parcel-preparation.jpg",
    imageAlt:
      "A parcel being prepared for courier delivery in Nepal",
    readTime: "4 min read",
    content: [
      {
        type: "paragraph",
        text: "Preparing a parcel properly before courier collection can make the handover process easier and help protect the contents during handling and transportation.",
      },
      {
        type: "heading",
        text: "Choose the right packaging",
      },
      {
        type: "paragraph",
        text: "Select packaging that is appropriate for the size, weight, and nature of the item. The package should be strong enough for normal handling during shipment.",
      },
      {
        type: "heading",
        text: "Secure the contents",
      },
      {
        type: "paragraph",
        text: "Place the contents securely inside the package so they do not move unnecessarily. For items that need additional protection, suitable internal cushioning can be useful.",
      },
      {
        type: "heading",
        text: "Check the delivery information",
      },
      {
        type: "paragraph",
        text: "Before handing over the parcel, check that the recipient name, phone number, destination, and other required shipment details are correct.",
      },
      {
        type: "heading",
        text: "Keep important information accessible",
      },
      {
        type: "paragraph",
        text: "If the shipment requires any specific information or instructions, communicate those details clearly during the courier handover.",
      },
      {
        type: "list",
        items: [
          "Use suitable packaging for the item.",
          "Secure the contents inside the package.",
          "Check recipient and destination information.",
          "Keep shipment details ready for handover.",
        ],
      },
    ],
  },

  {
    slug: "courier-logistics-tips-for-online-sellers",
    title: "Courier Logistics Tips for Online Sellers",
    excerpt:
      "Practical ways online sellers can organize parcel pickup, shipment information, and delivery workflows.",
    category: "E-commerce Logistics",
    date: "2026-10-03",
    image: "/images/blog/online-seller-logistics.jpg",
    imageAlt:
      "Online seller preparing parcels for courier pickup",
    readTime: "5 min read",
    content: [
      {
        type: "paragraph",
        text: "For an online seller, delivery is part of the customer experience. A simple and organized courier workflow can make it easier to manage daily orders.",
      },
      {
        type: "heading",
        text: "Keep parcel information organized",
      },
      {
        type: "paragraph",
        text: "Maintain clear information about customer names, phone numbers, delivery locations, parcel details, and COD requirements where applicable.",
      },
      {
        type: "heading",
        text: "Prepare parcels before pickup",
      },
      {
        type: "paragraph",
        text: "Having parcels ready before the pickup window helps reduce unnecessary delays during the handover process.",
      },
      {
        type: "heading",
        text: "Track shipment progress",
      },
      {
        type: "paragraph",
        text: "Keep track of shipment status so you can respond to customer questions with the information available to you.",
      },
      {
        type: "heading",
        text: "Maintain a return process",
      },
      {
        type: "paragraph",
        text: "Online sellers should also have a clear internal process for handling exchanges and returns when they occur.",
      },
    ],
  },

  {
    slug: "cod-guidance-for-online-sellers",
    title: "COD Guidance for Online Sellers",
    excerpt:
      "Important things online sellers should consider when managing cash-on-delivery shipments.",
    category: "COD Guidance",
    date: "2026-10-01",
    image: "/images/blog/cod-online-sellers.jpg",
    imageAlt:
      "Cash on delivery parcel prepared by an online seller",
    readTime: "5 min read",
    content: [
      {
        type: "paragraph",
        text: "Cash on delivery can be useful for online sellers, but it also requires organized shipment and payment records.",
      },
      {
        type: "heading",
        text: "Record COD shipments clearly",
      },
      {
        type: "paragraph",
        text: "Keep a clear record of which orders require cash collection and make sure the shipment information matches the order information.",
      },
      {
        type: "heading",
        text: "Communicate clearly with customers",
      },
      {
        type: "paragraph",
        text: "Customers should know the amount expected at delivery and any relevant information about their order before the parcel arrives.",
      },
      {
        type: "heading",
        text: "Monitor delivery status",
      },
      {
        type: "paragraph",
        text: "Following shipment progress can help sellers identify delivered, pending, returned, or other shipment statuses.",
      },
    ],
  },

  {
    slug: "packaging-basics-for-courier-parcels",
    title: "Packaging Basics for Courier Parcels",
    excerpt:
      "A practical guide to choosing suitable packaging and preparing parcels before shipment.",
    category: "Packaging Tips",
    date: "2026-09-28",
    image: "/images/blog/packaging-basics.jpg",
    imageAlt:
      "Courier parcel packaging materials and prepared packages",
    readTime: "4 min read",
    content: [
      {
        type: "paragraph",
        text: "Good packaging starts with understanding what you are sending and how much protection it needs during normal courier handling.",
      },
      {
        type: "heading",
        text: "Match packaging to the item",
      },
      {
        type: "paragraph",
        text: "Different items require different levels of protection. Choose packaging based on the size, shape, weight, and characteristics of the contents.",
      },
      {
        type: "heading",
        text: "Avoid unnecessary movement",
      },
      {
        type: "paragraph",
        text: "Where appropriate, use suitable internal material to reduce excessive movement of the contents inside the package.",
      },
      {
        type: "heading",
        text: "Seal the package properly",
      },
      {
        type: "paragraph",
        text: "Make sure the package is securely closed before courier handover.",
      },
    ],
  },

  {
    slug: "understanding-courier-shipment-status",
    title: "Understanding Common Courier Shipment Statuses",
    excerpt:
      "What common shipment statuses mean and how they fit into the courier delivery process.",
    category: "Delivery Updates",
    date: "2026-09-25",
    image: "/images/blog/shipment-tracking.jpg",
    imageAlt:
      "Courier shipment tracking status displayed on a phone",
    readTime: "4 min read",
    content: [
      {
        type: "paragraph",
        text: "Shipment tracking helps customers and sellers understand where a parcel is within the delivery process.",
      },
      {
        type: "heading",
        text: "Package Created",
      },
      {
        type: "paragraph",
        text: "This generally indicates that shipment information has been entered into the courier workflow.",
      },
      {
        type: "heading",
        text: "Picked Up",
      },
      {
        type: "paragraph",
        text: "The parcel has been collected from the sender or pickup location.",
      },
      {
        type: "heading",
        text: "In Transit",
      },
      {
        type: "paragraph",
        text: "The shipment is moving through the delivery process toward its destination.",
      },
      {
        type: "heading",
        text: "Out for Delivery",
      },
      {
        type: "paragraph",
        text: "The shipment has reached the stage where delivery is being attempted.",
      },
      {
        type: "heading",
        text: "Delivered",
      },
      {
        type: "paragraph",
        text: "The shipment has been marked as delivered in the tracking system.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}