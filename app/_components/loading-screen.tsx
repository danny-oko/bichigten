"use client";

import Lottie from "lottie-react";
// Import your downloaded JSON file verbatim
import loadingData from "@/public/animations/loading-bear.json";

export default function LoadingScreen() {
  return (
    <div className="w-full h-full">
      <Lottie animationData={loadingData} loop={true} autoplay={true} />
    </div>
  );
}
