/** @type {import('next').NextConfig} */
const nextConfig = {
  // sharp is used directly in the admin's save action to re-encode uploads;
  // keep it external so it loads its native binary at runtime.
  serverExternalPackages: ["sharp"],
  images: {
    // Supabase Storage serves uploaded bike photos from the project domain.
    // The hostname is filled in from the env var once the project exists.
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    formats: ["image/webp"],
  },
};

export default nextConfig;
