import { site } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";

// ✨ Per-page SEO in one line — title, canonical, Open Graph & Twitter, all set.
export const metadata = site.meta({
  title: "Contact",
  path: "/contact",
  description: "Get in touch with LSFolio.",
});

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-black gradient-text sm:text-5xl">Get in touch</h1>
      <p className="mt-4 text-muted">Have a question or a project in mind? Drop a message below.</p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  );
}
