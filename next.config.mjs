/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig = {
   reactStrictMode: false,
   images: {
      unoptimized: true,
   },
   source: '/(.*)',
   headers: [
      {
         key: 'Content-Security-Policy',
         value: cspHeader.replace(/\n/g, ''),
      },
   ],
   // TODO : komen config dibawah jika running lokal, aktifkan kembali ketika push
   // output: "export",
   // assetPrefix:
   //    "https://central-computer-improvement-org.github.io/Web-Profile-Backoffice",
   // basePath: "/Web-Profile-Backoffice",
   // experimental: {
   //    missingSuspenseWithCSRBailout: false,
   // },
};

export default nextConfig;
