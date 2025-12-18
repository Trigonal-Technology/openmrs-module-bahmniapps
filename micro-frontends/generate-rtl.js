/**
 * Post-build script to generate RTL CSS files for micro-frontends
 * Run this after webpack build: node generate-rtl.js
 */

const rtlcss = require('rtlcss');
const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../ui/app/micro-frontends-dist');

// Find all CSS files in the output directory
function findCSSFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findCSSFiles(filePath));
    } else if (file.endsWith('.css') && !file.endsWith('.rtl.css')) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Generate RTL CSS files
const cssFiles = findCSSFiles(outputDir);

if (cssFiles.length === 0) {
  console.log('No CSS files found to process for RTL');
  process.exit(0);
}

console.log(`Found ${cssFiles.length} CSS file(s) to process for RTL...`);

cssFiles.forEach(cssFile => {
  try {
    const css = fs.readFileSync(cssFile, 'utf8');
    const rtlCss = rtlcss.process(css);
    const rtlFile = cssFile.replace(/\.css$/, '.rtl.css');
    
    fs.writeFileSync(rtlFile, rtlCss, 'utf8');
    console.log(`Generated: ${path.relative(outputDir, rtlFile)}`);
  } catch (error) {
    console.error(`Error processing ${cssFile}:`, error.message);
  }
});

console.log('RTL CSS generation complete!');

