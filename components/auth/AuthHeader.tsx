import Image from "next/image";

export function AuthHeader() {
  return (
    <div className="-mb-0.5 flex w-full justify-center px-1 sm:-mb-1">
      <Image
        src="/logo.png"
        alt="Mazaalai Learn"
        width={454}
        height={184}
        priority
        className="mx-auto h-auto w-full max-w-[176px] max-h-28 object-contain sm:max-h-32"
        sizes="176px"
      />
    </div>
  );
}
