const fs = require("fs");
const path = require("path");

const preCommitHook = `#!/bin/sh
# Auto-build presentations when presentation.md files are modified

# Check if any presentation.md files have been modified
if git diff --cached --name-only | grep -q "presentation\\.md$"; then
  echo "📝 Presentation files detected, building presentations..."
  npm run build
  
  # Check if build was successful
  if [ $? -eq 0 ]; then
    # Add the built files to the commit
    find . -name "index.html" -path "*/20*/*" -exec git add {} \\;
    git add index.html
    
    echo "✅ Presentations built and added to commit"
  else
    echo "❌ Build failed - commit aborted"
    exit 1
  fi
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

  console.log("✅ Git pre-commit hook installed successfully!");
  console.log("");
  console.log("📝 The hook will automatically:");
  console.log(
    "   - Build presentations when presentation.md files are modified"
  );
  console.log("   - Add built index.html files to your commit");
  console.log("   - Abort commit if build fails");
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
