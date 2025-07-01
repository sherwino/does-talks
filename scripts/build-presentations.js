const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function findPresentations(dir = ".") {
  const presentations = [];

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      if (
        item.isDirectory() &&
        !item.name.startsWith(".") &&
        item.name !== "node_modules" &&
        item.name !== "scripts"
      ) {
        const fullPath = path.join(currentDir, item.name);

        // Check if this directory contains a presentation.md
        const presentationPath = path.join(fullPath, "presentation.md");
        if (fs.existsSync(presentationPath)) {
          presentations.push({ dir: fullPath, file: presentationPath });
        }

        // Recursively scan subdirectories
        scanDirectory(fullPath);
      }
    }
  }

  scanDirectory(dir);
  return presentations;
}

function buildPresentation(presentationData) {
  const { dir, file } = presentationData;
  const outputPath = path.join(dir, "index.html");

  console.log(`📝 Building: ${file}`);
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

// Main execution
try {
  console.log("🔍 Scanning for presentations...");
  const presentations = findPresentations();
  console.log(`📊 Found ${presentations.length} presentations\n`);

  let successCount = 0;
  let failureCount = 0;

  presentations.forEach((presentation, index) => {
    console.log(`[${index + 1}/${presentations.length}]`);
    if (buildPresentation(presentation)) {
      successCount++;
    } else {
      failureCount++;
    }
    console.log("");
  });

  console.log("📊 Build Summary:");
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);

  if (failureCount === 0) {
    console.log("\n🎉 All presentations built successfully!");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some presentations failed to build.");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Build script error:", error);
  process.exit(1);
}
