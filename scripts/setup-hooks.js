const fs = require("fs");
const path = require("path");

const preCommitHook = `#!/bin/sh
# Auto-build presentations when presentation.md files are modified

# Get list of modified presentation.md files
changed_presentations=$(git diff --cached --name-only | grep "presentation\\.md$")

if [ -n "$changed_presentations" ]; then
  echo "📝 Modified presentation files detected:"
  echo "$changed_presentations"
  echo ""
  
  build_failed=false
  
  # Build each changed presentation individually
  echo "$changed_presentations" | while read -r file; do
    if [ -n "$file" ]; then
      dir=$(dirname "$file")
      echo "🔨 Building: $file"
      
      # Change to presentation directory and build
      cd "$dir"
      if npx marp presentation.md --output index.html --html --no-config-file >/dev/null 2>&1; then
        echo "   ✅ Success: $dir/index.html"
        git add index.html
      else
        echo "   ❌ Failed: $file"
        build_failed=true
      fi
      cd - >/dev/null
    fi
  done
  
  # Check if any builds failed
  if [ "$build_failed" = true ]; then
    echo ""
    echo "❌ Some presentations failed to build - commit aborted"
    exit 1
  fi
  
  # Regenerate index page (since presentations may have changed)
  echo ""
  echo "🏗️  Regenerating index page..."
  if node scripts/generate-index.js >/dev/null 2>&1; then
    echo "   ✅ Index updated"
    git add index.html
  else
    echo "   ❌ Index generation failed - commit aborted"
    exit 1
  fi
  
  echo ""
  echo "✅ Presentations built and added to commit"
fi
`;

try {
  const hooksDir = ".git/hooks";
  const preCommitPath = path.join(hooksDir, "pre-commit");

  // Check if .git directory exists
  if (!fs.existsSync(".git")) {
    console.log(
      "❌ Not a git repository. Run this from the root of your git repository."
    );
    process.exit(1);
  }

  // Create hooks directory if it doesn't exist
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Write the pre-commit hook
  fs.writeFileSync(preCommitPath, preCommitHook);

  // Make it executable (Unix systems)
  try {
    fs.chmodSync(preCommitPath, "755");
  } catch (error) {
    console.log(
      "⚠️  Could not make hook executable. You may need to run: chmod +x .git/hooks/pre-commit"
    );
  }

  console.log("✅ Optimized git pre-commit hook installed successfully!");
  console.log("");
  console.log("📝 The hook will now:");
  console.log("   - Only build presentations that have actually changed");
  console.log("   - Regenerate the index page if any presentations changed");
  console.log("   - Add only the affected files to your commit");
  console.log("   - Abort commit if any build fails");
  console.log("");
  console.log(
    "🔧 To disable the hook temporarily: mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled"
  );
  console.log(
    "🔧 To re-enable: mv .git/hooks/pre-commit.disabled .git/hooks/pre-commit"
  );
} catch (error) {
  console.error("❌ Error setting up git hook:", error.message);
  process.exit(1);
}
