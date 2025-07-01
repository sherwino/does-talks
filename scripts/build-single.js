const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function buildPresentation(presentationPath) {
  const dir = path.dirname(presentationPath);
  const outputPath = path.join(dir, "index.html");

  // Check if presentation.md exists
  if (!fs.existsSync(presentationPath)) {
    console.log(`❌ Presentation not found: ${presentationPath}`);
    return false;
  }

  console.log(`📝 Building: ${presentationPath}`);
  console.log(`   Output: ${outputPath}`);

  try {
    // Change to the presentation directory
    const originalCwd = process.cwd();
    process.chdir(dir);

    // Build the presentation
    execSync(
      "npx marp presentation.md --output index.html --html --no-config-file",
      {
        stdio: "pipe",
      }
    );

    // Return to original directory
    process.chdir(originalCwd);

    // Check if file was created
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log(`   ✅ Success (${Math.round(stats.size / 1024)}KB)`);
      return true;
    } else {
      console.log(`   ❌ Failed - no output file`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Failed - ${error.message}`);
    return false;
  }
}

// Get the presentation path from command line arguments
const presentationPath = process.argv[2];

if (!presentationPath) {
  console.log("Usage: node scripts/build-single.js <path-to-presentation.md>");
  console.log("");
  console.log("Examples:");
  console.log(
    "  node scripts/build-single.js 2024/01/ih-guide/presentation.md"
  );
  console.log(
    "  node scripts/build-single.js ./2025/07/shopify-no-code/presentation.md"
  );
  process.exit(1);
}

// Normalize the path
const normalizedPath = path.normalize(presentationPath);

try {
  if (buildPresentation(normalizedPath)) {
    console.log("🎉 Presentation built successfully!");
    process.exit(0);
  } else {
    console.log("❌ Build failed");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Build script error:", error);
  process.exit(1);
}
