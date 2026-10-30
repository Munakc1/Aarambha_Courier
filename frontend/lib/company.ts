export const COMPANY = {
  name: "Aarambha Courier",
  location: "Kupondole, Lalitpur, Nepal",
  phones: [
    { display: "9801255799", tel: "+9779801255799" },
    { display: "9801255790", tel: "+9779801255790" },
  ],
  email: "aarambhatransport@gmail.com",
  siteUrl: "https://www.aarambhacourier.com",
};

export const WHATSAPP_NUMBER = "9779801255799";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Aarambha Courier, I would like to talk about courier and logistics support for my business.";

export function whatsappUrl(
  message: string = DEFAULT_WHATSAPP_MESSAGE
) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}