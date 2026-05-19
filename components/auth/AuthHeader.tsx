import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="flex w-full justify-center">
      <Image
        src="/logo.png"
        alt="Mazaalai Learn"
        width={454}
        height={184}
        priority
        className="mx-auto h-auto w-full max-w-[160px] object-contain sm:max-w-[180px]"
        sizes="180px"
      />
    </div>
  );
}
