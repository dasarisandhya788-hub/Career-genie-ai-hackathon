export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function validateForm(fields) {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === "string" && !value.trim())) {
      return { valid: false, error: `${key} is required.` };
    }
  }
  return { valid: true };
}
