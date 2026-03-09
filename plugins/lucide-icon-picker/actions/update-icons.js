/**
 * Fetch the latest list of icons from Lucide Icons library via GitHub API.
 * Extracts unique icon names from the icons directory (base names of .svg/.json files).
 */
export default async function getLatestLucideIcons() {
  try {
    console.log("Fetching Lucide Icons list...");

    const response = await fetch(
      "https://api.github.com/repos/lucide-icons/lucide/contents/icons?ref=main"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch icons: ${response.statusText}`);
    }

    const files = await response.json();
    const iconsSet = new Set();

    for (const file of files) {
      if (file.type !== "file" || !file.name) continue;
      const match = file.name.match(/^(.+)\.(svg|json)$/);
      if (match) {
        iconsSet.add(match[1]);
      }
    }

    const icons = Array.from(iconsSet).sort();

    console.log(`Found ${icons.length} icons.`);

    const formattedCode = `// Lucide Icons List (${icons.length} icons)
// Updated on: ${new Date().toISOString().split("T")[0]}

const LUCIDE_ICONS = [
  ${icons.map((icon) => `"${icon}"`).join(",\n  ")}
];

// If you need it as a simple string separated by commas:
// ${icons.join(", ")}
`;

    return {
      success: true,
      code: formattedCode,
      count: icons.length,
      icons,
    };
  } catch (error) {
    console.error("Error fetching Lucide icons:", error);
    throw error;
  }
}
