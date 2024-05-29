/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  images: {
    domains: ["uvqbmnlilrmokoiawtlv.supabase.co"],
  },
};
export default nextConfig;
