"use client";

import Lottie from "lottie-react";
// Import your downloaded JSON file verbatim
import incorrectData from "@/public/animations/incorrect-bear.json";

export default function IncorrectBear() {
  return (
    <div className="w-full h-full">
      <Lottie animationData={incorrectData} loop={true} autoplay={true} />
    </div>
  );
}
