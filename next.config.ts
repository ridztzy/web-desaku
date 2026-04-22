import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost:3000", "portal-wringinanom.web.id"],

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "portal-wringinanom.web.id"],
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
