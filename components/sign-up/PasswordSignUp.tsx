import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PasswordSignUpProps = {
  password: string;
  confirmPassword: string;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
};

export function PasswordSignUp({
  password,
  confirmPassword,
  onChangePassword,
  onChangeConfirmPassword,
}: PasswordSignUpProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-amber-950 sm:text-3xl">
          Secure your account
        </h1>
        <p className="text-sm text-amber-900/70 sm:text-base">
          Choose a strong password you don&apos;t use elsewhere.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <Field>
          <FieldLabel htmlFor="password" className="text-sm font-semibold tracking-wide text-[#E8920A]">
            Password
          </FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold tracking-wide text-[#E8920A]">
            Confirm Password
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => onChangeConfirmPassword(e.target.value)}
            className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
          />
        </Field>
      </div>
    </div>
  );
}
