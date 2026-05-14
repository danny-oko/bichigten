import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="-mb-0.5 flex justify-center sm:-mb-1">
      <Image
        src="/logo.png"
        alt="Mazaalai Learn"
        width={500}
        height={500}
        priority
        className="h-auto max-h-32 w-auto max-w-[min(100vw-24px,240px)] object-contain sm:max-h-40 sm:max-w-[280px]"
      />
    </div>
  );
}
