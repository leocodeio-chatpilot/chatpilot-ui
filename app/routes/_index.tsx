import type { MetaFunction } from "@remix-run/node";
import Header from "~/components/landing/LandingHeader";
import { useTranslation } from "react-i18next";
import { LandingHero } from "~/components/landing/LandingHero";
import HowItWorks from "~/components/landing/HowItWorks";
import Pricing from "~/components/landing/Pricing";

export const meta: MetaFunction = () => {
  return [
    { title: "Spectral-UI" },
    { name: "description", content: "Welcome to Spectral!" },
  ];
};

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full bg-hero-bg bg-cover bg-no-repeat bg-center dark:bg-hero-bg-light">
        <Header />
        <LandingHero />
        <HowItWorks />
        <Pricing />
      </div>
    </div>
  );
}
