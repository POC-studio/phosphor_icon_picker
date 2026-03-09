/**
 * Fetch the latest list of icons from Phosphor Icons library
 * We will fetch from the core library on unpkg which exposes a list of all icons
 */
export default async function getLatestPhosphorIcons() {
  try {
    // There are multiple ways to get the list, one reliable way is to fetch the icon definitions
    // from the core library. Another is to parse the github raw files.
    // Let's use the core library which has an index of all icons.
    
    // We'll fetch the core library package.json to find the latest version, 
    // but unpkg redirects to latest by default.
    // The Phosphor Icons core package has a `icons.json` or similar, 
    // actually they export an array in `@phosphor-icons/core/src/icons.js` or similar.
    // Let's fetch the actual CSS file and parse the class names as a fallback,
    // or better, fetch from their raw github repository if possible.

    console.log("Fetching Phosphor Icons list...");
    
    // Using unpkg to fetch the metadata file from the core package
    // The core package has a file `index.d.ts` or similar that we could parse, 
    // but the most reliable way is often to parse the CSS file and extract `.ph-[icon-name]:before`
    
    const response = await fetch('https://unpkg.com/@phosphor-icons/web/src/regular/style.css');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch icons: ${response.statusText}`);
    }
    
    const cssContent = await response.text();
    
    // Parse CSS to find all class names starting with .ph-
    // Pattern: .ph-airplane:before { ... }
    const regex = /\.ph-([a-z0-9-]+):before/g;
    let match;
    const iconsSet = new Set();
    
    while ((match = regex.exec(cssContent)) !== null) {
      const iconName = match[1];
      // Exclude generic classes or modifiers if any
      if (iconName !== 'regular' && iconName !== 'fill' && iconName !== 'light' && iconName !== 'thin' && iconName !== 'bold' && iconName !== 'duotone') {
        iconsSet.add(iconName);
      }
    }
    
    const icons = Array.from(iconsSet).sort();
    
    console.log(`Found ${icons.length} icons.`);
    
    // Format the result as a JavaScript array string that can be copied
    const formattedCode = `// Phosphor Icons List (${icons.length} icons)
// Updated on: ${new Date().toISOString().split('T')[0]}

const PHOSPHOR_ICONS = [
  ${icons.map(icon => `"${icon}"`).join(',\n  ')}
];

// If you need it as a simple string separated by commas:
// ${icons.join(', ')}
`;

    return {
      success: true,
      code: formattedCode,
      count: icons.length
    };
    
  } catch (error) {
    console.error("Error fetching Phosphor icons:", error);
    throw error;
  }
}
