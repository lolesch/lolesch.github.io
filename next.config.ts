import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ADR-0001: GitHub Pages needs a fully static build.
  output: 'export',

  // No basePath. lolesch.github.io is a user site served from the domain root,
  // so a basePath would break every asset URL.

  // Emit /about/index.html instead of /about.html, which Pages serves more predictably.
  trailingSlash: true,

  images: { unoptimized: true },
};

export default nextConfig;
