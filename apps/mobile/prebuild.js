import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting prebuild process...");

try {
  // Change to root directory
  const rootDir = path.join(__dirname, "../..");
  console.log(`📂 Changing to root directory: ${rootDir}`);
  process.chdir(rootDir);

  // Run commands
  console.log("📦 Installing dependencies...");
  execSync("pnpm install", { stdio: "inherit" });

  console.log("🔨 Building workspace packages...");
  execSync("pnpm build", { stdio: "inherit" });

  // Change back to mobile directory
  const mobileDir = path.join(__dirname);
  console.log(`📂 Returning to mobile directory: ${mobileDir}`);
  process.chdir(mobileDir);

  console.log("✅ Prebuild completed successfully!");
} catch (error) {
  console.error("❌ Prebuild failed:", error.message);
  process.exit(1);
}
