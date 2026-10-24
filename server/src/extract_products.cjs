const fs = require('fs');

const content = fs.readFileSync('dist/assets/index-CwoXRdi6.js', 'utf8');

// The array starts right before [{id:"gpu-
const startSearch = '[{id:"gpu-';
const startIndex = content.indexOf(startSearch);
console.log('Start index:', startIndex);

if (startIndex !== -1) {
  // Let's find where the array closes
  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let quoteChar = '';
  let escape = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (inString) {
      if (char === quoteChar) {
        inString = false;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      quoteChar = char;
      continue;
    }
    if (char === '[') {
      depth++;
    } else if (char === ']') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  console.log('End index:', endIndex);
  if (endIndex !== -1) {
    const rawArray = content.substring(startIndex, endIndex + 1);
    // Evaluate it in a sandbox / function safely
    const fn = new Function('J', 'return ' + rawArray);
    const products = fn("/images/fan/mvj3x2uzqocrhg.jpeg");
    console.log(`Successfully extracted ${products.length} products!`);
    fs.writeFileSync('server/src/initialProducts.json', JSON.stringify(products, null, 2));
    console.log('Saved to server/src/initialProducts.json');
  }
}
