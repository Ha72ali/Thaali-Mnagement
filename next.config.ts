import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // When `npm run dev` is invoked from the parent folder, keep Turbopack rooted here.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
