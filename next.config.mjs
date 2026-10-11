/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  // The API function imports the shared Express/Mongoose implementation.
  outputFileTracingRoot: process.cwd(),
}
export default nextConfig
