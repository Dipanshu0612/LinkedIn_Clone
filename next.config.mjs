/** @type {import('next').NextConfig} */
const remotePatterns = [
  {
    protocol: "https",
    hostname: "links.papareact.com",
  },
  {
    protocol: "https",
    hostname: "img.clerk.com",
  },
];

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

if (r2PublicBaseUrl) {
  const r2Url = new URL(r2PublicBaseUrl);
  remotePatterns.push({
    protocol: r2Url.protocol.replace(":", ""),
    hostname: r2Url.hostname,
    pathname: `${r2Url.pathname.replace(/\/$/, "") || ""}/**`,
  });
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
