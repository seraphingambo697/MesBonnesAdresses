export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export type RegisterForm = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginForm = { email: string; password: string };

export type AddressForm = { name: string; description: string };

export type CommentFormValues = { text: string; rating: number };

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export const ADDRESS_NAME_MAX = 60;
export const ADDRESS_DESCRIPTION_MAX = 500;
export const COMMENT_TEXT_MAX = 500;

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

export function validateAddress(form: AddressForm): FormErrors<AddressForm> {
  const errors: FormErrors<AddressForm> = {};
  const name = form.name.trim();
  if (!name) errors.name = 'Le nom est obligatoire';
  else if (name.length > ADDRESS_NAME_MAX) errors.name = `${ADDRESS_NAME_MAX} caractères maximum`;
  if (form.description.trim().length > ADDRESS_DESCRIPTION_MAX)
    errors.description = `${ADDRESS_DESCRIPTION_MAX} caractères maximum`;
  return errors;
}

export function validateComment(form: CommentFormValues): FormErrors<CommentFormValues> {
  const errors: FormErrors<CommentFormValues> = {};
  if (!Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5)
    errors.rating = 'Choisis une note entre 1 et 5 étoiles';
  const text = form.text.trim();
  if (!text) errors.text = "Écris quelques mots sur l'adresse";
  else if (text.length > COMMENT_TEXT_MAX) errors.text = `${COMMENT_TEXT_MAX} caractères maximum`;
  return errors;
}

export const hasErrors = (errors: object): boolean => Object.keys(errors).length > 0;