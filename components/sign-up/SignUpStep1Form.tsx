import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { mnLabels } from "@/lib/i18n/mn-copy";

import {
  signUpFieldStack,
  signUpInputClass,
  signUpLabelClass,
} from "./sign-up-classes";

type Step1FieldKey = "fullName" | "username" | "age";

type SignUpStep1FormProps = {
  fullName: string;
  username: string;
  age: string;
  onChangeFullName: (value: string) => void;
  onChangeUsername: (value: string) => void;
  onChangeAge: (value: string) => void;
  fieldErrors?: Partial<Record<Step1FieldKey, string>>;
};

export function SignUpStep1Form({
  fullName,
  username,
  age,
  onChangeFullName,
  onChangeUsername,
  onChangeAge,
  fieldErrors,
}: SignUpStep1FormProps) {
  return (
    <div className={signUpFieldStack}>
      <Field className="gap-1.5" data-invalid={fieldErrors?.fullName ? true : undefined}>
        <FieldLabel htmlFor="name" className={signUpLabelClass}>
          {mnLabels.fullName}
        </FieldLabel>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => onChangeFullName(e.target.value)}
          autoComplete="name"
          aria-invalid={fieldErrors?.fullName ? true : undefined}
          className={signUpInputClass}
        />
        {fieldErrors?.fullName ? (
          <FieldError className="leading-snug">{fieldErrors.fullName}</FieldError>
        ) : null}
      </Field>
      <Field className="gap-1.5" data-invalid={fieldErrors?.username ? true : undefined}>
        <FieldLabel htmlFor="username" className={signUpLabelClass}>
          {mnLabels.username}
        </FieldLabel>
        <Input
          id="username"
          value={username}
          onChange={(e) => onChangeUsername(e.target.value)}
          autoComplete="username"
          aria-invalid={fieldErrors?.username ? true : undefined}
          className={signUpInputClass}
        />
        {fieldErrors?.username ? (
          <FieldError className="leading-snug">{fieldErrors.username}</FieldError>
        ) : null}
      </Field>
      <Field className="gap-1.5" data-invalid={fieldErrors?.age ? true : undefined}>
        <FieldLabel htmlFor="age" className={signUpLabelClass}>
          {mnLabels.age}
        </FieldLabel>
        <Input
          id="age"
          type="text"
          inputMode="numeric"
          autoComplete="bday-year"
          placeholder={mnLabels.age}
          value={age}
          onChange={(e) => onChangeAge(e.target.value.replace(/\D/g, ""))}
          aria-invalid={fieldErrors?.age ? true : undefined}
          className={signUpInputClass}
        />
        {fieldErrors?.age ? (
          <FieldError className="leading-snug">{fieldErrors.age}</FieldError>
        ) : null}
      </Field>
    </div>
  );
}
