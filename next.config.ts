import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * pg laster deler av seg selv med dynamiske require-kall. Blir den pakket inn
   * av bundleren, feiler tilkoblingen først når koden kjører – typisk som en 500
   * ved første databasekall. Denne linjen lar den ligge som en vanlig node-modul.
   */
  serverExternalPackages: ["pg"],
};

export default nextConfig;
