import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mnAuth, mnLabels } from "@/lib/i18n/mn-copy";

type PasswordSignUpProps = {
  email: string;
  password: string;
  confirmPassword: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
};

export function PasswordSignUp({
  email,
  password,
  confirmPassword,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
}: PasswordSignUpProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        <Field>
          <FieldLabel
            htmlFor="email"
            className="text-sm font-semibold tracking-wide text-[#E8920A]"
          >
            {mnLabels.email}
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={mnAuth.emailPlaceholder}
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
          />
        </Field>
        <Field>
          <FieldLabel
            htmlFor="password"
            className="text-sm font-semibold tracking-wide text-[#E8920A]"
          >
            {mnLabels.password}
          </FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder={mnAuth.passwordPlaceholder}
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
          />
        </Field>
        <Field>
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-sm font-semibold tracking-wide text-[#E8920A]"
          >
            {mnLabels.confirmPassword}
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder={mnAuth.passwordPlaceholder}
            value={confirmPassword}
            onChange={(e) => onChangeConfirmPassword(e.target.value)}
            className="h-11 rounded-2xl border-amber-300/80 bg-[#F8F4E3] text-sm transition-shadow focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400/35 sm:h-12 sm:text-base"
          />
        </Field>
      </div>
    </div>
  );
}
