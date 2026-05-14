import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mnLabels } from "@/lib/i18n/mn-copy";

import {
  signUpFieldStack,
  signUpInputClass,
  signUpLabelClass,
} from "./sign-up-classes";

type Step2FieldKey = "email" | "password" | "confirmPassword";

type SignUpStep2FormProps = {
  email: string;
  password: string;
  confirmPassword: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  fieldErrors?: Partial<Record<Step2FieldKey, string>>;
};

export function SignUpStep2Form({
  email,
  password,
  confirmPassword,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  fieldErrors,
}: SignUpStep2FormProps) {
  return (
    <div className={signUpFieldStack}>
      <Field className="gap-1.5" data-invalid={fieldErrors?.email ? true : undefined}>
        <FieldLabel htmlFor="email" className={signUpLabelClass}>
          {mnLabels.email}
        </FieldLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          autoComplete="email"
          aria-invalid={fieldErrors?.email ? true : undefined}
          className={signUpInputClass}
        />
        {fieldErrors?.email ? (
          <FieldError className="leading-snug">{fieldErrors.email}</FieldError>
        ) : null}
      </Field>
      <Field className="gap-1.5" data-invalid={fieldErrors?.password ? true : undefined}>
        <FieldLabel htmlFor="password" className={signUpLabelClass}>
          {mnLabels.password}
        </FieldLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          autoComplete="new-password"
          aria-invalid={fieldErrors?.password ? true : undefined}
          className={signUpInputClass}
        />
        {fieldErrors?.password ? (
          <FieldError className="leading-snug">{fieldErrors.password}</FieldError>
        ) : null}
      </Field>
      <Field
        className="gap-1.5"
        data-invalid={fieldErrors?.confirmPassword ? true : undefined}
      >
        <FieldLabel htmlFor="confirmPassword" className={signUpLabelClass}>
          {mnLabels.confirmPassword}
        </FieldLabel>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onChangeConfirmPassword(e.target.value)}
          autoComplete="new-password"
          aria-invalid={fieldErrors?.confirmPassword ? true : undefined}
          className={signUpInputClass}
        />
        {fieldErrors?.confirmPassword ? (
          <FieldError className="leading-snug">
            {fieldErrors.confirmPassword}
          </FieldError>
        ) : null}
      </Field>
    </div>
  );
}
