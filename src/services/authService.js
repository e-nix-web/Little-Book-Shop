const SESSION_KEY = "little-bookshop-demo-session";
const PROFILES_KEY = "little-bookshop-demo-profiles";

const demoProfiles = [
  {
    id: "demo-customer",
    email: "customer@littlebookshop.demo",
    name: "Alex Reader",
    role: "customer",
  },
  {
    id: "demo-admin",
    email: "admin@littlebookshop.demo",
    name: "Sam Shopkeeper",
    role: "admin",
  },
];

const getProfiles = () => {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
    return Array.isArray(profiles) ? profiles : [];
  } catch {
    return [];
  }
};

const persistSession = (profile) => {
  try {
    sessionStorage.setItem(SESSION_KEY, profile.id);
  } catch {
    throw new Error("Your browser could not save the demo session.");
  }
};

const wait = () => new Promise((resolve) => window.setTimeout(resolve, 180));

export const authService = {
  async signIn(email, password) {
    await wait();
    const normalizedEmail = email.trim().toLowerCase();
    const demoUser = demoProfiles.find((profile) => profile.email === normalizedEmail);
    const expectedPassword =
      demoUser?.role === "admin" ? "bookshop-admin" : "bookshop-reader";

    if (!demoUser || password !== expectedPassword) {
      throw new Error("Email or password is not correct.");
    }

    persistSession(demoUser);
    return demoUser;
  },

  async signUp(name, email) {
    await wait();
    const normalizedEmail = email.trim().toLowerCase();
    const allProfiles = [...demoProfiles, ...getProfiles()];
    if (allProfiles.some((profile) => profile.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const profile = {
      id: `customer-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
      email: normalizedEmail,
      name: name.trim(),
      role: "customer",
    };

    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify([...getProfiles(), profile]));
    } catch {
      throw new Error("Your browser could not save this demo account.");
    }
    persistSession(profile);
    return profile;
  },

  async restoreSession() {
    await wait();
    let id;
    try {
      id = sessionStorage.getItem(SESSION_KEY);
    } catch {
      throw new Error("Your browser could not restore the demo session.");
    }
    if (!id) return null;

    const profile = [...getProfiles(), ...demoProfiles].find((item) => item.id === id);
    if (!profile || !["customer", "admin"].includes(profile.role)) {
      this.signOut();
      return null;
    }
    return profile;
  },

  async requestPasswordReset(email) {
    await wait();
    if (!email.trim()) throw new Error("Enter an email address.");
    return "If an account exists for that email, reset instructions would be sent.";
  },

  async resetPassword(password, confirmation) {
    await wait();
    if (password.length < 8) throw new Error("Use at least 8 characters.");
    if (password !== confirmation) throw new Error("The passwords do not match.");
    return "Password reset is a UI demo. No password was changed.";
  },

  updateProfile(profile, name) {
    const updated = { ...profile, name: name.trim() };
    const savedProfiles = getProfiles().filter((item) => item.id !== profile.id);
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify([...savedProfiles, updated]));
    } catch {
      throw new Error("Your browser could not save the demo profile.");
    }
    return updated;
  },

  signOut() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      throw new Error("Your browser could not clear the demo session.");
    }
  },
};
