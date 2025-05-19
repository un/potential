import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get platform from command line args
const platform = process.argv[2];
if (!platform) {
  console.error("❌ Platform argument is required");
  process.exit(1);
}

console.log(`🚀 Starting build for platform: ${platform}`);

try {
  // Change to root directory
  const rootDir = path.join(__dirname, "../..");
  console.log(`📂 Changing to root directory: ${rootDir}`);
  process.chdir(rootDir);

  // Run commands
  console.log("📦 Installing dependencies...");
  execSync("pnpm install --frozen-lockfile", { stdio: "inherit" });

  // Ensure workspace dependencies are properly linked
  console.log("🔗 Linking workspace dependencies...");
  execSync("pnpm install -r", { stdio: "inherit" });

  console.log("🔨 Building workspace packages...");
  execSync("pnpm build", { stdio: "inherit" });

  // Change back to mobile directory
  const mobileDir = path.join(__dirname);
  console.log(`📂 Returning to mobile directory: ${mobileDir}`);
  process.chdir(mobileDir);

  // Run EAS build with platform flag
  console.log("🏗️  Running EAS build...");
  execSync(
    `eas build --profile production --platform ${platform} --message "First Proper Build?" --local`,
    { stdio: "inherit" },
  );

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
