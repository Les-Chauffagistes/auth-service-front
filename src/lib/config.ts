export const config = {
  get BASE_URL() {
    return typeof window !== "undefined"
      ? (window.__CONFIG__?.BASE_URL ?? "")
      : (process.env.BASE_URL ?? "");
  },
  get AUTH_URL() {
    return typeof window !== "undefined"
      ? (window.__CONFIG__?.AUTH_URL ?? "")
      : (process.env.AUTH_URL ?? "");
  },
};
