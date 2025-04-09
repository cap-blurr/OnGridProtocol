import { ChevronRight } from "lucide-react";
import localFont from "next/font/local";
import Link from "next/link";
import { Button } from "../ui/button";

function CTA() {
  return (
    <div className="bg-oga-green-dark w-10/12 max-w-7xl mx-auto p-8 sm:p-12 md:p-24 my-16 flex flex-col items-center justify-center text-center rounded-3xl">
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-gray-200/90`}
      >
        Investing in Clean Energy, Empowering Communities
      </h2>

      <p className="text-base md:text-xl font-medium max-w-3xl my-8 text-gray-200/90">
        Every investment drives positive change—expanding access to clean
        electricity, reducing CO₂ emissions, and fueling sustainable economic
        growth. By supporting solar companies, you help power homes, businesses,
        and communities while earning a return.
      </p>
      <Link href="https://forms.gle/weTesyUcPou2Snug9" target="blank">
        <Button  className="mt-4 bg-zinc-900/90 text-white text-base md:text-lg px-8 py-3 h-12 rounded-full font-medium hover:bg-black/90 transition-colors">
          Get Access{" "}
          <ChevronRight className="h-5 w-5 inline-block ml-2 text-oga-yellow" />
        </Button>
      </Link>
    </div>
  );
}

export default CTA;
