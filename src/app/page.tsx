import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { IntroCards } from "@/components/IntroCards/IntroCards";
import { content } from "@/data/content";
import { AboutCheckU } from "@/components/AboutCheckU/AboutCheckU";
import { Footer } from "@/components/Footer/Footer";
import { ProductBanner } from "@/components/ProductBanner/ProductBanner";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">{content.navigation.skip}</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <IntroCards />
        <AboutCheckU />
        <ProductBanner />
      </main>
      <Footer />
    </>
  );
}
