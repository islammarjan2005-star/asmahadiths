#!/usr/bin/env node
/**
 * Hadith Downloader for ChatGPT Categorization
 * Downloads all hadiths and formats them for easy upload to ChatGPT
 *
 * Usage: node download-hadiths.js
 * Output: Creates files in ./hadith-data/ folder
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const collections = {
  bukhari: { name: 'Sahih Bukhari', total: 7563 },
  muslim: { name: 'Sahih Muslim', total: 3033 },
  abudawud: { name: 'Sunan Abu Dawud', total: 3999 },
  tirmidhi: { name: 'Jami at-Tirmidhi', total: 3956 },
  ibnmajah: { name: 'Sunan Ibn Majah', total: 4341 },
  nasai: { name: 'Sunan an-Nasai', total: 5758 },
};

const outputDir = path.join(__dirname, 'hadith-data');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadCollection(key) {
  const col = collections[key];
  console.log(`\nDownloading ${col.name}...`);

  const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${key}.json`;

  try {
    const data = await fetch(url);
    const hadiths = data.hadiths || [];

    console.log(`  Found ${hadiths.length} hadiths`);

    // Format for ChatGPT - simple numbered list
    let output = `# ${col.name} - ${hadiths.length} Hadiths\n`;
    output += `# Format: [Number] Text\n`;
    output += `# For ChatGPT: Categorize each by topic (marriage, motherhood, daughters, female_companions, modesty, worship, kindness, inheritance)\n\n`;

    hadiths.forEach(h => {
      // Clean text - remove extra whitespace, newlines
      const text = (h.text || '').replace(/\s+/g, ' ').trim();
      if (text) {
        output += `[${h.hadithnumber}] ${text}\n\n`;
      }
    });

    // Save full file
    const filename = `${key}-full.txt`;
    fs.writeFileSync(path.join(outputDir, filename), output);
    console.log(`  Saved: ${filename}`);

    // Also create batched files (500 hadiths each) for easier ChatGPT processing
    const batchSize = 500;
    const batches = Math.ceil(hadiths.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, hadiths.length);
      const batch = hadiths.slice(start, end);

      let batchOutput = `# ${col.name} - Batch ${i + 1}/${batches} (Hadiths ${start + 1}-${end})\n`;
      batchOutput += `# Categorize each: marriage, motherhood, daughters, female_companions, modesty, worship, kindness, inheritance\n`;
      batchOutput += `# Return ONLY hadith numbers that relate to women, grouped by category\n\n`;

      batch.forEach(h => {
        const text = (h.text || '').replace(/\s+/g, ' ').trim();
        if (text) {
          batchOutput += `[${h.hadithnumber}] ${text}\n\n`;
        }
      });

      const batchFilename = `${key}-batch-${String(i + 1).padStart(2, '0')}.txt`;
      fs.writeFileSync(path.join(outputDir, batchFilename), batchOutput);
    }

    console.log(`  Created ${batches} batch files (500 hadiths each)`);

    return hadiths.length;
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    return 0;
  }
}

async function main() {
  console.log('========================================');
  console.log('Hadith Downloader for ChatGPT');
  console.log('========================================');
  console.log(`Output folder: ${outputDir}`);

  let total = 0;

  for (const key of Object.keys(collections)) {
    const count = await downloadCollection(key);
    total += count;
  }

  console.log('\n========================================');
  console.log(`DONE! Downloaded ${total.toLocaleString()} hadiths`);
  console.log('========================================');
  console.log('\nFiles created in:', outputDir);
  console.log('\nHow to use with ChatGPT:');
  console.log('1. Upload a batch file (e.g., bukhari-batch-01.txt)');
  console.log('2. Ask: "Review these hadiths. Return ONLY the hadith numbers');
  console.log('   that specifically relate to women, grouped by category:');
  console.log('   marriage, motherhood, daughters, female_companions,');
  console.log('   modesty, worship, kindness, inheritance"');
  console.log('3. Repeat for each batch file');
  console.log('4. Compile the numbers into the app\'s curatedHadiths object');
}

main();
