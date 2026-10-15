import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full shrink">
          <Image
            src="/sun.svg"
            alt="Sunda"
            width={32}
            height={40}
            className="mr-4 rounded-md"
          />
          Bahasa Sunda
        </Button>
        <Button size="lg" variant="ghost" className="w-full shrink">
          <Image
            src="/jaw.svg"
            alt="Jawa"
            width={32}
            height={40}
            className="mr-4 rounded-md"
          />
          Bahasa Jawa
        </Button>
      </div>
    </footer>
  );
};
