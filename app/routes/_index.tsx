import type { MetaFunction } from "@remix-run/node";
import LandingHeader from "~/components/landing/LandingHeader";
import { LandingHero } from "~/components/landing/LandingHero";
import HowItWorks from "~/components/landing/HowItWorks";
import Pricing from "~/components/landing/Pricing";
import Contact from "~/components/landing/Contact";
import { loader as LandingLoader } from "./loader+/landing.loader";
import { action as LandingMailAction } from "~/routes/action+/landing+/mail";
export const meta: MetaFunction = () => {
  return [
    { title: "Spectral-UI" },
    { name: "description", content: "Welcome to Spectral!" },
  ];
};

export const action = LandingMailAction;
export const loader = LandingLoader;

export default function Index() {
  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full bg-hero-bg bg-cover bg-no-repeat bg-center dark:bg-hero-bg-light">
        <LandingHeader />
        <LandingHero />
        <HowItWorks />
        <Contact />
        <Pricing />
      </div>
    </div>
  );
}
