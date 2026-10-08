import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@playernguyen/core", "@playernguyen/database"],
};

export default nextConfig;
