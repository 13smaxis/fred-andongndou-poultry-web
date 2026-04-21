import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
	distDir: ".n",
	outputFileTracingRoot: resolve(process.cwd(), ".."),
};

export default nextConfig;
