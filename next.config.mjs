/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  images: {
    domains: ["vjabkhngmcqtmwxzwmun.supabase.co"],
  },
};
export default nextConfig;
