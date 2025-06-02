import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/login",
        destination: "http://127.0.0.1:8000/login/",
      },
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*/",
      },
      {
        source: "/api/criar_deck",
        destination: "http://127.0.0.1:8000/criar_deck",
      },
      {
        source: "/api/todos_decks",
        destination: "http://127.0.0.1:8000/todos_decks/",
      },
    ];
  },
};

export default nextConfig;
