import { authStorage } from '../../data/storage/authStorage';

const normalizeEmail = (email) => email.trim().toLowerCase();

export const authService = {
  async hydrateAuthState() {
    const [users, currentUser] = await Promise.all([
      authStorage.getUsers(),
      authStorage.getSessionUser(),
    ]);

    return {
      users,
      currentUser,
    };
  },

  async register(user) {
    const name = user?.name?.trim();
    const email = normalizeEmail(user?.email ?? '');
    const password = user?.password?.trim();

    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const users = await authStorage.getUsers();
    const existingUser = users.find((storedUser) => normalizeEmail(storedUser.email) === email);

    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    };

    const nextUsers = [...users, newUser];

    await authStorage.saveUsers(nextUsers);

    return {
      users: nextUsers,
      currentUser: null,
    };
  },

  async login(email, password) {
    const normalizedEmail = normalizeEmail(email ?? '');
    const normalizedPassword = (password ?? '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email and password are required.');
    }

    const users = await authStorage.getUsers();
    const user = users.find(
      (storedUser) =>
        normalizeEmail(storedUser.email) === normalizedEmail &&
        storedUser.password === normalizedPassword
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    await authStorage.saveSessionUser(user);

    return {
      users,
      currentUser: user,
    };
  },

  async logout() {
    await authStorage.clearSessionUser();
    return {
      currentUser: null,
    };
  },
};
