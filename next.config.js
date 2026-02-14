/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "connect-src 'self' https:",
              "frame-src 'self' https:",
              "img-src 'self' data: https:",
              "font-src 'self' data: https:",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
