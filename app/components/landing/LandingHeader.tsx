import { Button } from "@/components/ui/button";
import { Link, useSubmit } from "@remix-run/react";
import { ModeToggle } from "@/components/mode-toggle";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { language } from "@/utils/language";

export default function LandingHeader() {
  const { i18n } = useTranslation();
  const submit = useSubmit();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (value: string) => {
    submit(
      { locale: value },
      { method: "post", action: "/action/set-language" }
    );
  };

  return (
    <header
      className={`
        flex h-auto w-full shrink-0 items-center p-4 py-5 md:px-6 fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${
          scrolled
            ? "bg-white/90 dark:bg-black/90 backdrop-blur-md backdrop-saturate-150 border-b border-gray-200 dark:border-gray-800 shadow-sm"
            : "bg-transparent border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-xl font-bold text-black dark:text-white flex items-center gap-2"
        >
          Chatpilot
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Select
          onValueChange={handleLanguageChange}
          defaultValue={i18n.language}
        >
          <SelectTrigger className="w-[100px] bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(language).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          asChild
          className="border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-black/80 backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Link to="/auth/signin">Sign in</Link>
        </Button>
        <Button asChild className="bg-[#915EFF] hover:bg-[#7c4fe0] text-white">
          <Link to="/auth/signup">Sign Up</Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
