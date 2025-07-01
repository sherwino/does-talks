const fs = require("fs");
const path = require("path");

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
          // Extract metadata from presentation.md
          const presentationContent = fs.readFileSync(presentationPath, "utf8");
          const metadata = extractMetadata(presentationContent, fullPath);
          presentations.push(metadata);
        }

        // Recursively scan subdirectories
        scanDirectory(fullPath);
      }
    }
  }

  scanDirectory(dir);
  return presentations.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function extractMetadata(content, dirPath) {
  // Parse frontmatter and content to extract title and description
  const lines = content.split("\n");
  let title = "Untitled Presentation";
  let description = "";

  // Look for the first heading as title
  for (const line of lines) {
    if (line.startsWith("# ") && !title.includes("Untitled")) {
      title = line.replace("# ", "").trim();
      break;
    } else if (line.startsWith("## ") && title === "Untitled Presentation") {
      title = line.replace("## ", "").trim();
      break;
    }
  }

  // Extract a description from content (first paragraph after headings)
  let foundContent = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      foundContent &&
      trimmed &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("---") &&
      !trimmed.startsWith("![") &&
      !trimmed.startsWith("<")
    ) {
      description = trimmed.replace(/[*_`]/g, ""); // Remove markdown formatting
      break;
    }
    if (trimmed.startsWith("#") || trimmed.includes("---")) {
      foundContent = true;
    }
  }

  // Extract date from directory structure (YYYY/MM format)
  const pathParts = dirPath.split(path.sep);
  let year = "";
  let month = "";
  let monthName = "";

  for (let i = 0; i < pathParts.length - 1; i++) {
    if (/^\d{4}$/.test(pathParts[i])) {
      year = pathParts[i];
      if (i + 1 < pathParts.length && /^\d{2}$/.test(pathParts[i + 1])) {
        month = pathParts[i + 1];
        monthName = getMonthName(parseInt(month));
      }
      break;
    }
  }

  const folderName = path.basename(dirPath);

  return {
    title:
      title === "Untitled Presentation" ? formatFolderName(folderName) : title,
    description: description || `Presentation: ${formatFolderName(folderName)}`,
    path: dirPath.replace(/\\/g, "/"), // Normalize path separators
    date: year ? `${year}-${month || "01"}-01` : new Date().toISOString(),
    displayDate: year ? `${monthName} ${year}` : "Recent",
    year: year || new Date().getFullYear().toString(),
  };
}

function formatFolderName(folderName) {
  return folderName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getMonthName(month) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1] || "Unknown";
}

function generateHTML(presentations) {
  // Group presentations by year
  const byYear = presentations.reduce((acc, pres) => {
    if (!acc[pres.year]) acc[pres.year] = [];
    acc[pres.year].push(pres);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b - a);

  const yearSections = years
    .map(
      (year) => `
            <div class="year-section">
                <h2 class="year-title">${year}</h2>
                ${byYear[year]
                  .map(
                    (pres) => `
                <div class="presentation-card">
                    <a href="./${pres.path}/" class="presentation-link">
                        <h3 class="presentation-title">${pres.title}</h3>
                        <p class="presentation-date">${pres.displayDate}</p>
                        <p class="presentation-description">${pres.description}</p>
                    </a>
                </div>`
                  )
                  .join("")}
            </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Does Talks - Presentation Archive</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 3rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        h1 {
            text-align: center;
            margin-bottom: 0.5rem;
            color: #2c3e50;
            font-size: 2.5rem;
        }
        
        .subtitle {
            text-align: center;
            color: #7f8c8d;
            margin-bottom: 3rem;
            font-size: 1.2rem;
        }
        
        .presentations {
            display: grid;
            gap: 1.5rem;
        }
        
        .year-section {
            border-left: 4px solid #3498db;
            padding-left: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .year-title {
            font-size: 1.5rem;
            color: #2c3e50;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .presentation-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #e9ecef;
        }
        
        .presentation-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .presentation-link {
            text-decoration: none;
            color: inherit;
            display: block;
        }
        
        .presentation-title {
            font-size: 1.3rem;
            color: #2c3e50;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        .presentation-date {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .presentation-description {
            color: #555;
            font-size: 0.95rem;
        }
        
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
            color: #7f8c8d;
        }
        
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .count {
            background: #3498db;
            color: white;
            padding: 0.2rem 0.6rem;
            border-radius: 15px;
            font-size: 0.8rem;
            margin-left: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎤 Does Talks</h1>
        <p class="subtitle">A collection of presentations, slides, and talks <span class="count">${
          presentations.length
        } presentation${presentations.length !== 1 ? "s" : ""}</span></p>
        
        <div class="presentations">
            ${yearSections}
        </div>
        
        <div class="footer">
            <p>Built with ❤️ using <a href="https://marp.app/" target="_blank">Marp</a> • Deployed via GitHub Actions</p>
            <p style="margin-top: 0.5rem; font-size: 0.8rem;">Last updated: ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>`;
}

// Main execution
try {
  console.log("🔍 Scanning for presentations...");
  const presentations = findPresentations();
  console.log(`📊 Found ${presentations.length} presentations`);

  presentations.forEach((pres) => {
    console.log(`   📝 ${pres.title} (${pres.displayDate})`);
  });

  console.log("🏗️  Generating index.html...");
  const html = generateHTML(presentations);

  fs.writeFileSync("index.html", html);
  console.log("✅ Generated index.html successfully!");
} catch (error) {
  console.error("❌ Error generating index.html:", error);
  process.exit(1);
}
