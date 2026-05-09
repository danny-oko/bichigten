import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type NameSignUpProps = {
  fullName: string;
  username: string;
  email: string;
  onChangeFullName: (value: string) => void;
  onChangeUsername: (value: string) => void;
  onChangeEmail: (value: string) => void;
};

export function NameSignUp({
  fullName,
  username,
  email,
  onChangeFullName,
  onChangeUsername,
  onChangeEmail,
}: NameSignUpProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-amber-950 sm:text-3xl">
          What&apos;s your name?
        </h1>
        <p className="text-sm text-amber-900/70 sm:text-base">
          We&apos;ll use this to personalize your learning path.
        </p>
      </div>
      <Field>
        <FieldLabel htmlFor="name" className="text-sm font-semibold tracking-wide text-[#E8920A]">
          Full Name
        </FieldLabel>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => onChangeFullName(e.target.value)}
          className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="username" className="text-sm font-semibold tracking-wide text-[#E8920A]">
          User Name
        </FieldLabel>
        <Input
          id="username"
          value={username}
          onChange={(e) => onChangeUsername(e.target.value)}
          className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="email" className="text-sm font-semibold tracking-wide text-[#E8920A]">
          Email
        </FieldLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
        />
      </Field>
    </div>
  );
}
