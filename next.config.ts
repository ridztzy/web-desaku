import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.41",
    "192.168.1.27",
    "192.168.1.41:3000",
    "192.168.1.27:3000",
    "localhost:3000",
  ],

  experimental: {
    serverActions: {
      allowedOrigins: [
        "192.168.1.41:3000",
        "192.168.1.27:3000",
        "localhost:3000",
        "127.0.0.1:3000",
        "portal-wringinanom.digiwrinom.workers.dev",
        "digiwrinom.workers.dev",
      ],
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
