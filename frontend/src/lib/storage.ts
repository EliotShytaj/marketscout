const EMAIL_STORAGE_KEY = "marketscout_email";

export const getStoredEmail = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(EMAIL_STORAGE_KEY) || "";
};

export const setStoredEmail = (email: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMAIL_STORAGE_KEY, email);
};

export const clearStoredEmail = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(EMAIL_STORAGE_KEY);
};
