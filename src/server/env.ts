function getEnv(name: "AUTH_URL" | "BASE_URL"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value.replace(/\/$/, "");
}

export const env = {
  get authUrl() {
    return getEnv("AUTH_URL");
  },
  get baseUrl() {
    return getEnv("BASE_URL");
  },
};
