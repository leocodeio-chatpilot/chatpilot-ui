import type { MetaFunction } from "@remix-run/node";
import Header from "~/components/landing/LandingHeader";
import { useTranslation } from "react-i18next";
import { LandingHero } from "~/components/landing/LandingHero";
import HowItWorks from "~/components/landing/HowItWorks";
import Pricing from "~/components/landing/Pricing";
import Contact from "~/components/landing/Contact";
import { action as LandingAction } from "~/routes/action+/landing+/mail";
import { useActionData } from "@remix-run/react";
import { act, useEffect } from "react";
import { toast } from "~/hooks/use-toast";
export const meta: MetaFunction = () => {
  return [
    { title: "Spectral-UI" },
    { name: "description", content: "Welcome to Spectral!" },
  ];
};

export const action = LandingAction;

export default function Index() {
  const actionData = useActionData<typeof action>();
  console.log(actionData);
  const { t } = useTranslation();
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        toast({
          title: "email sent success",
          description: actionData.message,
          variant: "default",
        });
        console.log(actionData.message);
      } else {
        toast({
          title: "email sent error",
          description: actionData.message,
          variant: "destructive",
        });
        console.error(actionData.message);
      }
    }
  }, [actionData]);

  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full bg-hero-bg bg-cover bg-no-repeat bg-center dark:bg-hero-bg-light">
        <Header />
        <LandingHero />
        <HowItWorks />
        <Contact />
        <Pricing />
      </div>
    </div>
  );
}
