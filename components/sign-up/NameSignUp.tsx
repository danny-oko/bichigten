import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mnLabels } from "@/lib/i18n/mn-copy";

type NameSignUpProps = {
  fullName: string;
  username: string;
  age: string;
  onChangeFullName: (value: string) => void;
  onChangeUsername: (value: string) => void;
  onChangeAge: (value: string) => void;
};

export function NameSignUp({
  fullName,
  username,
  age,
  onChangeFullName,
  onChangeUsername,
  onChangeAge,
}: NameSignUpProps) {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      <Field>
        <FieldLabel
          htmlFor="name"
          className="text-sm font-semibold tracking-wide text-[#E8920A]"
        >
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
        <FieldLabel
          htmlFor="username"
          className="text-sm font-semibold tracking-wide text-[#E8920A]"
        >
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
        <FieldLabel
          htmlFor="age"
          className="text-sm font-semibold tracking-wide text-[#E8920A]"
        >
          {mnLabels.age}
        </FieldLabel>
        <Input
          id="age"
          type="text"
          inputMode="numeric"
          autoComplete="bday-year"
          value={age}
          onChange={(e) => onChangeAge(e.target.value.replace(/\D/g, ""))}
          className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
        />
      </Field>
    </div>
  );
}
