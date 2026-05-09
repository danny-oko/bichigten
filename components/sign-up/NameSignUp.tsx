import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mnLabels, mnSignUp } from "@/lib/i18n/mn-copy";

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
      <h1 className="text-2xl font-bold tracking-tight text-amber-950 sm:text-3xl">
        {mnSignUp.nameTitle}
      </h1>
      <Field>
        <FieldLabel htmlFor="name" className="text-sm font-semibold tracking-wide text-[#E8920A]">
          {mnLabels.fullName}
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
          {mnLabels.username}
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
          {mnLabels.email}
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
