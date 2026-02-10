export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
  services: {
    blog: process.env.BLOG_SERVICE_URL ?? "http://localhost:4001",
    authn: process.env.AUTHN_SERVICE_URL ?? "http://localhost:4000",
  },
};
