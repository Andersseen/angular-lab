import type { CompletionCardData } from '../models/achievement.model';

/**
 * Builds the shareable mission-completion card (see specs/engagement.md).
 *
 * The card is a standalone image that leaves the app, so it does not follow the
 * viewer's theme: it always renders the dark identity with literal hex values
 * from the `--al-*` dark palette. Fonts stay generic because no external font
 * can load inside an `<img>`-rendered SVG.
 */

const WIDTH = 1200;
const HEIGHT = 630;

const INK = '#f4f4f8';
const INK_MUTED = '#9da0b0';
const SURFACE = '#0b0d12';
const LINE = '#232734';
const BRAND = '#818cf8';
const ACCENT = '#22d3ee';

const SANS = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export const SHARE_CARD_SIZE = { width: WIDTH, height: HEIGHT } as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Greedy word wrap; the last kept line is ellipsised if anything is dropped. */
export function wrapText(
  text: string,
  maxChars: number,
  maxLines: number
): string[] {
  const lines: string[] = [];
  let line = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
    if (lines.length === maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && line) {
    lines.push(line);
  }

  const usedWords = lines.join(' ').split(/\s+/).filter(Boolean).length;
  const totalWords = text.split(/\s+/).filter(Boolean).length;
  if (usedWords < totalWords) {
    lines[lines.length - 1] = `${lines[lines.length - 1]}…`;
  }

  return lines;
}

function stat(x: number, label: string, value: string): string {
  return `
    <text x="${x}" y="512" font-family="${MONO}" font-size="20" letter-spacing="2" fill="${INK_MUTED}">${escapeXml(
      label.toUpperCase()
    )}</text>
    <text x="${x}" y="562" font-family="${MONO}" font-size="40" font-weight="700" fill="${INK}">${escapeXml(
      value
    )}</text>`;
}

export function buildShareCardSvg(data: CompletionCardData): string {
  const titleLines = wrapText(data.missionTitle, 26, 2);
  const title = titleLines
    .map(
      (line, index) =>
        `<text x="80" y="${268 + index * 84}" font-family="${SANS}" font-size="68" font-weight="700" fill="${INK}">${escapeXml(
          line
        )}</text>`
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(
    `Mission completed: ${data.missionTitle}`
  )}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND}" />
      <stop offset="100%" stop-color="${ACCENT}" />
    </linearGradient>
    <pattern id="blueprint" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0V28" fill="none" stroke="${LINE}" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${SURFACE}" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#blueprint)" opacity="0.55" />
  <rect width="${WIDTH}" height="10" fill="url(#brand)" />
  <text x="80" y="130" font-family="${MONO}" font-size="24" letter-spacing="6" fill="${ACCENT}">ANGULAR LAB</text>
  <text x="80" y="186" font-family="${SANS}" font-size="30" font-weight="600" fill="${INK_MUTED}">Mission completed</text>
  ${title}
  <text x="80" y="${titleLines.length > 1 ? 432 : 400}" font-family="${SANS}" font-size="28" fill="${INK_MUTED}">${escapeXml(
    `${data.track} · ${data.difficulty}`
  )}</text>
  <rect x="80" y="464" width="1040" height="1" fill="${LINE}" />
  ${stat(80, 'Streak', `${data.streakDays} ${data.streakDays === 1 ? 'day' : 'days'}`)}
  ${stat(430, 'Missions', `${data.missionsCompleted} / ${data.missionsTotal}`)}
  ${stat(780, 'Completed', data.completedOn)}
</svg>`;
}

export function buildShareText(data: CompletionCardData): string {
  const streak = data.streakDays > 1 ? ` on a ${data.streakDays}-day streak` : '';
  return (
    `I completed "${data.missionTitle}" on Angular Lab — ` +
    `${data.track}, ${data.difficulty}. ` +
    `${data.missionsCompleted} of ${data.missionsTotal} missions done${streak}. ` +
    `https://angular-lab.pages.dev`
  );
}

/** Inline data URL for `<img src>`; percent-encoding keeps it UTF-8 safe. */
export function shareCardDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
