import { CommonHero } from "@/components/common/CommonHero";
import CommonHeader from "~/components/common/CommonHeader";
import HowItWorks from "~/components/landing/HowItWorks";
import Pricing from "~/components/landing/Pricing";

// action and loaders
import { loader as HomeLoader } from "@/routes/loader+/home+/index";
import { action as LandingMailAction } from "~/routes/action+/landing+/mail";
import Contact from "~/components/landing/Contact";

export const loader = HomeLoader;
export const action = LandingMailAction;

export default function HomeIndex() {
  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full bg-hero-bg bg-cover bg-no-repeat bg-center dark:bg-hero-bg-light">
        <CommonHeader />
        <CommonHero />
        <HowItWorks />
        <Contact />
        <Pricing />
      </div>
    </div>
  );
}
