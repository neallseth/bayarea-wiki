/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/lyceum", destination: "/avalon", permanent: true }];
  },
};

export default nextConfig;
