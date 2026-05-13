import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "d64gsuwffb70l.cloudfront.net",
			},
		],
	},
};

export default nextConfig;
