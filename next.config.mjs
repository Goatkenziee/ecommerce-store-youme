/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compilerOptions: {
    // https://nextjs.org/docs/advanced-features/compiler/react-remove-properties
    removeConsole: true,
  },
};

export default nextConfig;
