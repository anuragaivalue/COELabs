/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
  },
  async redirects() {
    return [
      {
        source: "/enterprises",
        destination: "/customer",
        permanent: true,
      },
      {
        source: "/poc",
        destination: "/request-poc",
        permanent: true,
      },
      {
        source: "/marketplace",
        destination: "/portal/marketplace",
        permanent: true,
      },
      {
        source: "/calculator/roi",
        destination: "/calculator/soc",
        permanent: false,
      },
      {
        source: "/calculator/roi.php",
        destination: "/calculator/soc",
        permanent: false,
      },
      {
        source: "/calculator/roiIDAM",
        destination: "/calculator/idam",
        permanent: false,
      },
      {
        source: "/calculator/roiIDAM.php",
        destination: "/calculator/idam",
        permanent: false,
      },
      {
        source: "/calculator/roiPAM",
        destination: "/calculator/pam",
        permanent: false,
      },
      {
        source: "/calculator/roiPAM.php",
        destination: "/calculator/pam",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
