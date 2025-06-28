import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "ik.imagekit.io",
  //       port: "",
  //     },
  //   ],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
  // Runtime configuration
  serverRuntimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY,
  },
};

export default nextConfig;
