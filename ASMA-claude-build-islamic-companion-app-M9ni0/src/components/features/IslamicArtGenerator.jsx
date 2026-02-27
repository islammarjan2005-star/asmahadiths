import React, { useMemo } from 'react';

// Simple deterministic hash from string seed
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Seeded PRNG (mulberry32)
function createRng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = [
  // Teal sanctuary
  { bg: '#f0f5f4', lines: ['#0d9488', '#115e59', '#5eead4'], accent: '#c7a94e' },
  // Gold warmth
  { bg: '#faf6ee', lines: ['#c7a94e', '#a08535', '#e8d5a0'], accent: '#0d9488' },
  // Deep blue
  { bg: '#eff6ff', lines: ['#1e40af', '#3b82f6', '#93c5fd'], accent: '#c7a94e' },
  // Rose softness
  { bg: '#fef2f2', lines: ['#9f1239', '#e11d48', '#fda4af'], accent: '#0d9488' },
  // Emerald calm
  { bg: '#ecfdf5', lines: ['#065f46', '#10b981', '#6ee7b7'], accent: '#c7a94e' },
];

const DARK_PALETTES = [
  { bg: '#1a2a2a', lines: ['#5eead4', '#0d9488', '#99f6e4'], accent: '#c7a94e' },
  { bg: '#2a2518', lines: ['#e8d5a0', '#c7a94e', '#fde68a'], accent: '#5eead4' },
  { bg: '#1e2a3a', lines: ['#93c5fd', '#3b82f6', '#60a5fa'], accent: '#c7a94e' },
  { bg: '#2a1a1e', lines: ['#fda4af', '#e11d48', '#fb7185'], accent: '#5eead4' },
  { bg: '#1a2e22', lines: ['#6ee7b7', '#10b981', '#34d399'], accent: '#c7a94e' },
];

function generateStarPolygon(rng, cx, cy, r, palette) {
  const points = Math.floor(rng() * 4) * 2 + 6; // 6, 8, 10, 12
  const skip = Math.floor(points / 2) - 1;
  const paths = [];

  // Outer star
  for (let layer = 0; layer < 3; layer++) {
    const layerR = r * (1 - layer * 0.25);
    const rotation = layer * (Math.PI / points);
    const pts = [];
    for (let i = 0; i < points; i++) {
      const angle = (2 * Math.PI * i) / points + rotation;
      pts.push([cx + layerR * Math.cos(angle), cy + layerR * Math.sin(angle)]);
    }
    // Connect with skip pattern
    for (let i = 0; i < points; i++) {
      const j = (i + skip) % points;
      paths.push(
        `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${palette.lines[layer % palette.lines.length]}" stroke-width="${1.5 - layer * 0.3}" opacity="${0.8 - layer * 0.15}" />`
      );
    }
  }

  // Center circle
  paths.push(
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.08}" fill="${palette.accent}" opacity="0.6" />`
  );

  return paths.join('\n');
}

function generateRosette(rng, cx, cy, r, palette) {
  const petals = Math.floor(rng() * 4) + 6; // 6-9
  const paths = [];

  // Petal circles
  for (let i = 0; i < petals; i++) {
    const angle = (2 * Math.PI * i) / petals;
    const px = cx + r * 0.5 * Math.cos(angle);
    const py = cy + r * 0.5 * Math.sin(angle);
    paths.push(
      `<circle cx="${px}" cy="${py}" r="${r * 0.4}" fill="none" stroke="${palette.lines[i % palette.lines.length]}" stroke-width="1" opacity="0.5" />`
    );
  }

  // Inner radial lines
  for (let i = 0; i < petals * 2; i++) {
    const angle = (2 * Math.PI * i) / (petals * 2);
    const x1 = cx + r * 0.1 * Math.cos(angle);
    const y1 = cy + r * 0.1 * Math.sin(angle);
    const x2 = cx + r * 0.85 * Math.cos(angle);
    const y2 = cy + r * 0.85 * Math.sin(angle);
    paths.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${palette.lines[0]}" stroke-width="0.5" opacity="0.25" />`
    );
  }

  // Concentric circles
  for (let i = 1; i <= 4; i++) {
    paths.push(
      `<circle cx="${cx}" cy="${cy}" r="${r * i * 0.22}" fill="none" stroke="${palette.lines[1] || palette.lines[0]}" stroke-width="${0.8}" opacity="${0.3 - i * 0.05}" />`
    );
  }

  // Center dot
  paths.push(
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.06}" fill="${palette.accent}" opacity="0.7" />`
  );

  return paths.join('\n');
}

function generateTessellation(rng, size, palette) {
  const paths = [];
  const tileSize = size / (Math.floor(rng() * 2) + 4); // 4-5 tiles across
  const rows = Math.ceil(size / tileSize) + 1;
  const cols = Math.ceil(size / tileSize) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      const colorIdx = (row + col) % palette.lines.length;

      // Kite pattern within each tile
      const cx = x + tileSize / 2;
      const cy = y + tileSize / 2;
      const s = tileSize * 0.4;

      paths.push(
        `<polygon points="${cx},${cy - s} ${cx + s * 0.6},${cy} ${cx},${cy + s * 0.3} ${cx - s * 0.6},${cy}" fill="none" stroke="${palette.lines[colorIdx]}" stroke-width="0.8" opacity="0.5" />`
      );

      // Small diamond at intersections
      if (row > 0 && col > 0) {
        const ds = tileSize * 0.12;
        paths.push(
          `<polygon points="${x},${y - ds} ${x + ds},${y} ${x},${y + ds} ${x - ds},${y}" fill="${palette.accent}" opacity="0.3" />`
        );
      }
    }
  }

  return paths.join('\n');
}

function generateInterlace(rng, cx, cy, r, palette) {
  const paths = [];
  const arms = Math.floor(rng() * 3) + 4; // 4-6

  // Interlocking bands
  for (let ring = 0; ring < 3; ring++) {
    const ringR = r * (0.35 + ring * 0.25);
    const segments = arms * (ring + 2);

    for (let i = 0; i < segments; i++) {
      const a1 = (2 * Math.PI * i) / segments;
      const a2 = (2 * Math.PI * (i + 1)) / segments;
      const aMid = (a1 + a2) / 2;

      const inner = ringR - r * 0.08;
      const outer = ringR + r * 0.08;

      const x1 = cx + inner * Math.cos(a1);
      const y1 = cy + inner * Math.sin(a1);
      const x2 = cx + outer * Math.cos(aMid);
      const y2 = cy + outer * Math.sin(aMid);
      const x3 = cx + inner * Math.cos(a2);
      const y3 = cy + inner * Math.sin(a2);

      paths.push(
        `<path d="M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}" fill="none" stroke="${palette.lines[ring % palette.lines.length]}" stroke-width="1.2" opacity="${0.6 - ring * 0.1}" />`
      );
    }
  }

  // Connecting spokes
  for (let i = 0; i < arms; i++) {
    const angle = (2 * Math.PI * i) / arms;
    const x1 = cx + r * 0.15 * Math.cos(angle);
    const y1 = cy + r * 0.15 * Math.sin(angle);
    const x2 = cx + r * 0.9 * Math.cos(angle);
    const y2 = cy + r * 0.9 * Math.sin(angle);
    paths.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${palette.accent}" stroke-width="0.6" opacity="0.35" />`
    );
  }

  // Center ornament
  const cs = r * 0.1;
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * i) / 4;
    paths.push(
      `<circle cx="${cx + cs * Math.cos(angle)}" cy="${cy + cs * Math.sin(angle)}" r="${r * 0.02}" fill="${palette.accent}" opacity="0.5" />`
    );
  }

  return paths.join('\n');
}

function generateMuqarnas(rng, size, palette) {
  const paths = [];
  const steps = Math.floor(rng() * 2) + 3; // 3-4 layers
  const cx = size / 2;
  const cy = size / 2;

  for (let layer = 0; layer < steps; layer++) {
    const segments = (layer + 2) * 4;
    const layerR = (size * 0.4 * (layer + 1)) / steps;

    for (let i = 0; i < segments; i++) {
      const a1 = (2 * Math.PI * i) / segments;
      const a2 = (2 * Math.PI * (i + 0.5)) / segments;
      const a3 = (2 * Math.PI * (i + 1)) / segments;

      const innerR = layerR * 0.7;
      const outerR = layerR;

      const p1 = [cx + innerR * Math.cos(a1), cy + innerR * Math.sin(a1)];
      const p2 = [cx + outerR * Math.cos(a2), cy + outerR * Math.sin(a2)];
      const p3 = [cx + innerR * Math.cos(a3), cy + innerR * Math.sin(a3)];

      paths.push(
        `<polygon points="${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}" fill="${palette.lines[layer % palette.lines.length]}" opacity="${0.15 + layer * 0.05}" stroke="${palette.lines[layer % palette.lines.length]}" stroke-width="0.5" />`
      );
    }
  }

  // Border circle
  paths.push(
    `<circle cx="${cx}" cy="${cy}" r="${size * 0.42}" fill="none" stroke="${palette.lines[0]}" stroke-width="1" opacity="0.3" />`
  );

  return paths.join('\n');
}

export function IslamicArtGenerator({ seed = '1:1', size = 300, className = '', dark = false }) {
  const svgContent = useMemo(() => {
    const h = hashSeed(seed);
    const rng = createRng(h);
    const palettes = dark ? DARK_PALETTES : PALETTES;
    const palette = palettes[h % palettes.length];
    const patternType = h % 5;

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.42;

    let content;
    switch (patternType) {
      case 0:
        content = generateStarPolygon(rng, cx, cy, r, palette);
        break;
      case 1:
        content = generateRosette(rng, cx, cy, r, palette);
        break;
      case 2:
        content = generateTessellation(rng, size, palette);
        break;
      case 3:
        content = generateInterlace(rng, cx, cy, r, palette);
        break;
      case 4:
        content = generateMuqarnas(rng, size, palette);
        break;
      default:
        content = generateStarPolygon(rng, cx, cy, r, palette);
    }

    return { content, bg: palette.bg };
  }, [seed, size, dark]);

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: svgContent.bg }}
        dangerouslySetInnerHTML={{ __html: svgContent.content }}
      />
    </div>
  );
}
