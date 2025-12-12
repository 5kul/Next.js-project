import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // allow dev from LAN IP (change to your IP)
  allowedDevOrigins: ["192.168.29.180"],
};

export default nextConfig;
