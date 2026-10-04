
import { HeroArt } from "@/components/hero-art";
import Services from "@/components/Services";
import Vendorbanner from "@/components/Vendorbanner"
import Coverage from "@/components/Coverage"
import News from "@/components/News";
import Frq from "@/components/Faq"

export default function Home() {
  return (
    <main>
      <HeroArt />
      <Services />
      <Vendorbanner />
      <Coverage />
      <News />
      <Frq />

    </main>
  );
}
