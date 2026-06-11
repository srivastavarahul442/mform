/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      "@framework": "./src/be/framework/index.js",
    },
  },
};

export default nextConfig;


