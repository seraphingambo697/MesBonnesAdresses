export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export type RegisterForm = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginForm = { email: string; password: string };

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function validateRegister(form: RegisterForm): FormErrors<RegisterForm> {
  const errors: FormErrors<RegisterForm> = {};
  if (!form.displayName.trim()) errors.displayName = 'Le pseudo est obligatoire';
  if (!isValidEmail(form.email)) errors.email = 'Adresse e-mail invalide';
  if (form.password.length < 6) errors.password = '6 caractères minimum';
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  return errors;
}

export function validateLogin(form: LoginForm): FormErrors<LoginForm> {
  const errors: FormErrors<LoginForm> = {};
  if (!isValidEmail(form.email)) errors.email = 'Adresse e-mail invalide';
  if (!form.password) errors.password = 'Le mot de passe est obligatoire';
  return errors;
}

export const hasErrors = (errors: object): boolean => Object.keys(errors).length > 0;
