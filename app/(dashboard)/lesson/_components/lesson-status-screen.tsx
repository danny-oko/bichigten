import LoadingScreen from "@/app/_components/loading-screen";
import "@fontsource/plus-jakarta-sans";
import { Montserrat } from "next/font/google";

interface Props {
  message: string;
  description?: string;
  animated?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export function LessonStatusScreen({
  message,
  description,
  animated,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen font-['Plus_Jakarta_Sans'] ${montserrat.className}`}
    >
      <div className="flex-col w-full max-w-sm text-center flex justify-center items-center">
        <div
          className={`text-lg font-black text-black ${animated ? "animate-pulse" : ""}`}
        >
          <div className="w-[120px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[300px] aspect-square transition-all duration-300">
            <LoadingScreen />
          </div>
          {message}
        </div>
        {description && (
          <p className="mt-2 text-sm text-[#6B7280]">{description}</p>
        )}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-6 w-full py-4 rounded-2xl text-sm font-black tracking-widest uppercase text-white"
            style={{ background: "#58CC02", boxShadow: "0 4px 0 #3A8C01" }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
