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
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";

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
        flex h-auto w-full shrink-0 items-center p-3 py-3 md:p-4 md:py-5 md:px-6 fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${
          scrolled
            ? "bg-white/110 dark:bg-black/110 backdrop-blur-md backdrop-saturate-150 border-b border-gray-200 dark:border-gray-800 shadow-sm"
            : "bg-transparent border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-lg md:text-xl font-bold text-black dark:text-white flex items-center gap-2"
        >
          Chatpilot
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="ml-auto hidden sm:flex items-center gap-2">
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

      {/* Mobile Navigation */}
      <div className="ml-auto sm:hidden flex items-center gap-2">
        <Select
          onValueChange={handleLanguageChange}
          defaultValue={i18n.language}
        >
          <SelectTrigger className="w-full bg-white/80 dark:bg-gray-900/80">
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
        <ModeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col gap-4 mt-8">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-gray-300 dark:border-gray-700"
                >
                  <Link to="/auth/signin">Sign in</Link>
                </Button>
              </SheetClose>

              <SheetClose asChild>
                <Button
                  asChild
                  className="w-full bg-[#915EFF] hover:bg-[#7c4fe0] text-white"
                >
                  <Link to="/auth/signup">Sign Up</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
