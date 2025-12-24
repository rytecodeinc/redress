/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/closet.html", destination: "/closet", permanent: true },
      { source: "/wishlist.html", destination: "/wishlist", permanent: true },
      { source: "/outfit-builder.html", destination: "/outfit-builder", permanent: true },
    ];
  },
};

module.exports = nextConfig;

