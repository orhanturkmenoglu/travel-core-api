export const passwordRegex = () => {
  // Minimum 8 karakter, 1 büyük, 1 küçük, 1 rakam, 1 özel karakter
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
};

export const passwordMessage = () =>
  "Password must be at least 8 characters, include uppercase, lowercase, number, and special character (!@#$%^&*)";
