"use client";

import Lottie from "lottie-react";
// Import your downloaded JSON file verbatim
import mazaalaiData from "@/public/animations/mazaalai.json";

export default function Mascot() {
  return (
    <div className="w-full h-full">
      <Lottie animationData={mazaalaiData} loop={true} autoplay={true} />
    </div>
  );
}
