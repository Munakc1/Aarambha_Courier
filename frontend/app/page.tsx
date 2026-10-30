
import { HeroArt } from "@/components/hero-art";
import Services from "@/components/Services";
import Vendorbanner from "@/components/Vendorbanner"
import Coverage from "@/components/Coverage"
import News from "@/components/News";
import Frq from "@/components/Faq";
import EcommerceLogistics from "@/components/EcommerceLogistics";


export default function Home() {
  return (
    <main>
      <HeroArt />
      <Services />
      <EcommerceLogistics />
      <Vendorbanner />
      <Coverage />
      <News />
      <Frq />

    </main>
  );
}
