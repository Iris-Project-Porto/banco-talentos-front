export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[^a-zA-Z0-9]/,
} as const;

export const PASSWORD_RULES = [
  {
    id: "minLength",
    label: "Mínimo de 8 caracteres",
    test: (password: string) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "Pelo menos 1 letra maiúscula",
    test: (password: string) => PASSWORD_REGEX.uppercase.test(password),
  },
  {
    id: "number",
    label: "Pelo menos 1 número",
    test: (password: string) => PASSWORD_REGEX.number.test(password),
  },
  {
    id: "special",
    label: "Pelo menos 1 caractere especial",
    test: (password: string) => PASSWORD_REGEX.special.test(password),
  },
] as const;

export function getPasswordRuleStatus(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    met: rule.test(password),
  }));
}
