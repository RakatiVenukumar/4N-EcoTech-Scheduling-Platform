const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (name) => {
  if (!name || !name.trim()) {
    return 'Name is required.';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }

  return '';
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required.';
  }

  if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    return 'Please enter a valid email address.';
  }

  return '';
};

export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return 'Password is required.';
  }

  if (password.trim().length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return '';
};
