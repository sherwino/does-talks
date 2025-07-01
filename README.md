# Does Talks 🎤

A collection of presentations, slides, and talks built with [Marp](https://marp.app/) and deployed to GitHub Pages.

## 🚀 Quick Start

### Building Presentations

```bash
# Build all presentations and generate index
npm run build

# Build only presentations (skip index generation)
npm run build-presentations

# Build a single presentation
npm run build-single 2024/01/ih-guide/presentation.md

# Generate only the landing page index
npm run generate-index
```

### Setting Up Auto-Build Hooks

```bash
# Set up git hooks to automatically build presentations when you commit
npm run setup-hooks
```

After running this, presentations will automatically build when you modify `presentation.md` files and commit them.

## 📁 Project Structure

```
does-talks/
├── 2024/
│   ├── 01/ih-guide/
│   │   ├── presentation.md     # Source markdown
│   │   ├── index.html         # Built presentation (auto-generated)
│   │   └── assets/            # Images and assets
│   └── 07/ls-dash/
│       ├── presentation.md
│       ├── index.html
│       └── assets/
├── 2025/
│   └── 07/shopify-no-code/
│       ├── presentation.md
│       ├── index.html
│       └── assets/
├── scripts/
│   ├── build-presentations.js  # Builds all presentations
│   ├── generate-index.js      # Generates landing page
│   └── setup-hooks.js         # Sets up git hooks
├── index.html                 # Landing page (auto-generated)
└── package.json
```

## 🔄 Workflow

### Local Development

1. **Create a new presentation:**

   ```bash
   mkdir -p 2025/08/my-new-talk
   cd 2025/08/my-new-talk
   touch presentation.md
   ```

2. **Write your presentation** in `presentation.md` using Marp syntax

3. **Build and preview:**

   ```bash
   npm run build
   # Open index.html in browser to see landing page
   # Open 2025/08/my-new-talk/index.html to see your presentation
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add new presentation"
   # The git hook automatically builds presentations and includes built files
   ```

### Auto-Deployment

When you push to `main`:

- GitHub Actions generates the landing page
- Verifies all presentations are built
- Deploys everything to GitHub Pages

## 🛠️ Technical Details

### Build Process

- **Local builds** use Marp CLI in isolated directories to avoid file conflicts
- **Built presentations** (`index.html` files) are committed to the repository
- **Landing page** is dynamically generated from presentation metadata
- **GitHub Actions** only handles deployment (no building)

### Benefits of This Approach

✅ **Reliable builds** - No environment-specific Marp issues  
✅ **Fast deployments** - Pre-built files deploy instantly  
✅ **Version control** - Built presentations are tracked in git  
✅ **Offline preview** - Built presentations work without a server  
✅ **Automatic workflow** - Git hooks handle building automatically  
✅ **Efficient rebuilds** - Only changed presentations are rebuilt

### Smart Git Hooks

The git hooks are optimized to avoid unnecessary work:

- **Only rebuilds changed presentations** - Not all presentations every time
- **Regenerates index only when needed** - When presentations actually change
- **Fast commits** - Only processes what's actually modified
- **Clear feedback** - Shows exactly what's being built

Example hook output:

```
📝 Modified presentation files detected:
2024/01/ih-guide/presentation.md

🔨 Building: 2024/01/ih-guide/presentation.md
   ✅ Success: 2024/01/ih-guide/index.html

🏗️  Regenerating index page...
   ✅ Index updated

✅ Presentations built and added to commit
```

## 📝 Creating Presentations

Each presentation should be a Marp-compatible markdown file with frontmatter:

```markdown
---
marp: true
theme: uncover
---

# My Presentation Title

Content goes here...

---

## Slide 2

More content...
```

## 🎯 Available Scripts

| Script                        | Description                                  |
| ----------------------------- | -------------------------------------------- |
| `npm run build`               | Build all presentations + generate index     |
| `npm run build-presentations` | Build presentations only                     |
| `npm run build-single <path>` | Build a single presentation                  |
| `npm run generate-index`      | Generate landing page only                   |
| `npm run setup-hooks`         | Install git hooks for auto-building          |
| `npm run dev`                 | Build everything and show completion message |

## 🔧 Troubleshooting

### Presentations not building?

```bash
# Check if Marp CLI is working
npx marp --version

# Try building manually
cd path/to/presentation
npx marp presentation.md --output index.html --html
```

### Git hooks not working?

```bash
# Re-install hooks
npm run setup-hooks

# Check if hook exists and is executable
ls -la .git/hooks/pre-commit
```

### Deployment failing?

- Ensure all `index.html` files are committed
- Check GitHub Pages settings (should use "GitHub Actions" as source)
- Verify GitHub Actions has Pages write permissions

## 🌐 Live Site

Presentations are deployed to: [https://your-username.github.io/does-talks/](https://your-username.github.io/does-talks/)

---

Built with ❤️ using [Marp](https://marp.app/) and GitHub Actions
